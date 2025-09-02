'use client';

import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Upload, X, RotateCcw, Check, ZoomIn, ZoomOut } from 'lucide-react';
import { uploadFile } from '@/app/actions/timeline';
import { toast } from 'sonner';

interface ImageUploadWithCropperProps {
    onUploadComplete?: (url: string) => void;
    aspectRatio?: number | 'face';
    maxFileSize?: number; // in MB
    acceptedFileTypes?: string[];
    className?: string;
    title?: string;
}

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );
}

// Face-specific crop function for 1:1 aspect ratio with smaller initial size
function centerFaceCrop(
    mediaWidth: number,
    mediaHeight: number,
): Crop {
    const size = Math.min(mediaWidth, mediaHeight) * 0.6; // 60% of the smaller dimension
    const x = (mediaWidth - size) / 2;
    const y = (mediaHeight - size) / 2;

    return {
        unit: 'px',
        width: size,
        height: size,
        x,
        y,
    };
}

export function ImageUploadWithCropper({
    onUploadComplete,
    aspectRatio, // free aspect when undefined, 'face' for face cropping
    maxFileSize = 10, // 10MB default
    acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
    className = '',
    title = 'Image Upload with Cropper',
}: ImageUploadWithCropperProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [isUploading, setIsUploading] = useState(false);
    const [_, setIsCropping] = useState(false);
    const [zoom, setZoom] = useState(1);
    const imgRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onSelectFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!acceptedFileTypes.includes(file.type)) {
            toast.error(`Please select a valid image file (${acceptedFileTypes.join(', ')})`);
            return;
        }

        // Validate file size
        if (file.size > maxFileSize * 1024 * 1024) {
            toast.error(`File size must be less than ${maxFileSize}MB`);
            return;
        }

        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setImageUrl(url);
        setCrop(undefined);
        setCompletedCrop(undefined);
        setZoom(1); // Reset zoom when new image is selected
    }, [acceptedFileTypes, maxFileSize]);

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;

        if (aspectRatio === 'face') {
            // Special handling for face cropping - 1:1 aspect ratio
            const faceCrop = centerFaceCrop(width, height);
            setCrop(faceCrop);
        } else if (aspectRatio && aspectRatio > 0) {
            const fixedAspectCrop = centerAspectCrop(width, height, aspectRatio);
            setCrop(fixedAspectCrop);
        } else {
            const freeCrop = centerCrop(
                {
                    unit: '%',
                    width: 100,
                    height: 100,
                },
                width,
                height,
            );
            setCrop(freeCrop);
        }
    }, [aspectRatio]);

    const handleZoomIn = useCallback(() => {
        setZoom(prev => Math.min(prev + 0.1, 3)); // Max zoom 3x
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoom(prev => Math.max(prev - 0.1, 0.5)); // Min zoom 0.5x
    }, []);

    const getCroppedImg = useCallback(
        (
            image: HTMLImageElement,
            crop: PixelCrop,
            mimeType: string,
            quality: number = 1,
        ): Promise<Blob> => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                throw new Error('No 2d context');
            }

            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            const outputWidth = Math.round(crop.width * scaleX);
            const outputHeight = Math.round(crop.height * scaleY);

            // Add padding around the cropped content to avoid later shrink
            const paddingRatio = 0.08; // 8% padding on each side
            const paddingX = Math.round(outputWidth * paddingRatio);
            const paddingY = Math.round(outputHeight * paddingRatio);

            canvas.width = outputWidth + paddingX * 2;
            canvas.height = outputHeight + paddingY * 2;

            ctx.imageSmoothingQuality = 'high';

            // For JPEG exports, fill background to avoid black transparency fallback
            if (mimeType === 'image/jpeg') {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                paddingX,
                paddingY,
                outputWidth,
                outputHeight,
            );

            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                        return;
                    }
                    // Fallback if requested mimeType is not supported
                    canvas.toBlob((fallbackBlob) => {
                        if (fallbackBlob) {
                            resolve(fallbackBlob);
                        }
                    }, 'image/jpeg', 1);
                }, mimeType, quality);
            });
        },
        [],
    );

    const handleCropAndUpload = useCallback(async () => {
        if (!imgRef.current || !completedCrop || !selectedFile) {
            toast.error('Please select an image and crop it first');
            return;
        }

        setIsUploading(true);
        try {
            const croppedBlob = await getCroppedImg(
                imgRef.current,
                completedCrop,
                selectedFile.type,
                1,
            );

            // Create a new file from the cropped blob
            const croppedFile = new File([croppedBlob], selectedFile.name, {
                type: selectedFile.type,
                lastModified: Date.now(),
            });

            const formData = new FormData();
            formData.append("file", croppedFile);

            // Upload the cropped file
            const url = await uploadFile(formData);

            toast.success('Image uploaded successfully!');
            onUploadComplete?.(url);

            // Reset state
            handleReset();
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    }, [completedCrop, selectedFile, getCroppedImg, onUploadComplete]);

    const handleReset = useCallback(() => {
        setSelectedFile(null);
        setImageUrl(null);
        setCrop(undefined);
        setCompletedCrop(undefined);
        setIsCropping(false);
        setZoom(1);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const handleRotate = useCallback(() => {
        if (imgRef.current) {
            const currentRotation = imgRef.current.style.transform.match(/rotate\(([^)]+)\)/)?.[1] || '0deg';
            const currentAngle = parseInt(currentRotation) || 0;
            const newAngle = currentAngle + 90;
            imgRef.current.style.transform = `rotate(${newAngle}deg)`;
        }
    }, []);

    const handleFileDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && acceptedFileTypes.includes(file.type)) {
            if (file.size > maxFileSize * 1024 * 1024) {
                toast.error(`File size must be less than ${maxFileSize}MB`);
                return;
            }
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setImageUrl(url);
            setCrop(undefined);
            setCompletedCrop(undefined);
            setZoom(1);
        } else {
            toast.error(`Please select a valid image file (${acceptedFileTypes.join(', ')})`);
        }
    }, [acceptedFileTypes, maxFileSize]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    // Get the actual aspect ratio for ReactCrop
    const getCropAspectRatio = () => {
        if (aspectRatio === 'face') {
            return 1; // 1:1 aspect ratio for face cropping
        }
        return aspectRatio;
    };

    return (
        <Card className={`w-full p-2 border-none shadow-none max-w-2xl mx-auto ${className}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    {title}
                    {aspectRatio === 'face' && (
                        <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            Face Crop Mode
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-0">
                {!selectedFile ? (
                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                        onDrop={handleFileDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Drop image here or click to browse</p>
                        {aspectRatio === 'face' && (
                            <p className="text-sm text-primary-main mb-2">Face crop mode</p>
                        )}
                        <Button variant="outline" className='pointer-events-none'>
                            Choose File
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={acceptedFileTypes.join(',')}
                            onChange={onSelectFile}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Selected Image</span>
                                <span className="text-xs text-gray-500">
                                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleZoomOut}
                                        disabled={isUploading || zoom <= 0.5}
                                    >
                                        <ZoomOut className="w-4 h-4" />
                                    </Button>
                                    <span className="text-xs text-gray-500 min-w-[3rem] text-center">
                                        {Math.round(zoom * 100)}%
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleZoomIn}
                                        disabled={isUploading || zoom >= 3}
                                    >
                                        <ZoomIn className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRotate}
                                    disabled={isUploading}
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleReset}
                                    disabled={isUploading}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="relative border rounded-lg overflow-hidden">
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={getCropAspectRatio()}
                                minWidth={50}
                                minHeight={50}
                                circularCrop={aspectRatio === 'face'}
                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={imageUrl!}
                                    onLoad={onImageLoad}
                                    className="max-h-96 object-contain w-auto mx-auto"
                                    style={{
                                        transform: `scale(${zoom})`,
                                        transformOrigin: 'center',
                                    }}
                                />
                            </ReactCrop>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                {completedCrop && (
                                    <span>
                                        Crop size: {Math.round(completedCrop.width)} × {Math.round(completedCrop.height)}px
                                        {aspectRatio === 'face' && ' (Circular)'}
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleReset}
                                    disabled={isUploading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCropAndUpload}
                                    disabled={!completedCrop || isUploading}
                                    className="min-w-24"
                                >
                                    {isUploading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Uploading...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4" />
                                            Upload
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
