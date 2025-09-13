// 'use client';

// import React, { useState, useRef, useCallback } from 'react';
// import 'cropperjs/dist/cropper.css';
// import Cropper, { ReactCropperElement } from 'react-cropper';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
// import { Upload, X, RotateCcw, Check, ZoomIn, ZoomOut, ImageIcon } from 'lucide-react';
// import { uploadFile } from '@/app/actions/timeline';
// import { toast } from 'sonner';

// interface ImageUploadWithCropperProps {
//     onUploadComplete?: (url: string) => void;
//     aspectRatio?: number | 'face';
//     maxFileSize?: number; // in MB
//     acceptedFileTypes?: string[];
//     className?: string;
//     title?: string;
// }

// // Utilities for circular export when in face mode
// function drawCircularFromCanvas(source: HTMLCanvasElement): HTMLCanvasElement {
//     const size = Math.min(source.width, source.height);
//     const canvas = document.createElement('canvas');
//     canvas.width = size;
//     canvas.height = size;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return source;
//     ctx.imageSmoothingQuality = 'high';
//     ctx.clearRect(0, 0, size, size);
//     ctx.save();
//     ctx.beginPath();
//     ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
//     ctx.closePath();
//     ctx.clip();
//     const offsetX = (size - source.width) / 2;
//     const offsetY = (size - source.height) / 2;
//     ctx.drawImage(source, offsetX, offsetY);
//     ctx.restore();
//     return canvas;
// }

// export function ImageUploadWithCropper({
//     onUploadComplete,
//     aspectRatio, // free aspect when undefined, 'face' for face cropping
//     maxFileSize = 10, // 10MB default
//     acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
//     className = '',
//     title = 'Image Upload with Cropper',
// }: ImageUploadWithCropperProps) {
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [imageUrl, setImageUrl] = useState<string | null>(null);
//     const cropperRef = useRef<ReactCropperElement>(null);
//     const [completedCrop, setCompletedCrop] = useState<{ width: number; height: number }>();
//     const [isUploading, setIsUploading] = useState(false);
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const [_, setIsCropping] = useState(false);
//     const [zoom, setZoom] = useState(0.6);
//     // const imgRef = useRef<HTMLImageElement>(null);
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     const [cropMode, setCropMode] = useState<'face' | 'square' | 'rect'>(() => {
//         if (aspectRatio === 'face') return 'face';
//         if (typeof aspectRatio === 'number') return aspectRatio === 1 ? 'square' : 'rect';
//         return 'square';
//     });

//     const onSelectFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         // Validate file type
//         if (!acceptedFileTypes.includes(file.type)) {
//             toast.error(`Please select a valid image file (${acceptedFileTypes.join(', ')})`);
//             return;
//         }

//         // Validate file size
//         if (file.size > maxFileSize * 1024 * 1024) {
//             toast.error(`File size must be less than ${maxFileSize}MB`);
//             return;
//         }

//         setSelectedFile(file);
//         const url = URL.createObjectURL(file);
//         setImageUrl(url);
//         setCompletedCrop(undefined);
//         setZoom(1); // Reset zoom when new image is selected
//         setIsDialogOpen(true);
//     }, [acceptedFileTypes, maxFileSize]);

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const onImageLoad = useCallback((_e: React.SyntheticEvent<HTMLImageElement>) => {
//         // Cropper will handle initialization; nothing needed here
//     }, []);

//     const handleZoomIn = useCallback(() => {
//         setZoom(prev => Math.min(prev + 0.1, 3)); // Max zoom 3x
//     }, []);

//     const handleZoomOut = useCallback(() => {
//         setZoom(prev => Math.max(prev - 0.1, 0.5)); // Min zoom 0.5x
//     }, []);

//     const getCroppedImg = useCallback(
//         (mimeType: string, quality: number = 1): Promise<Blob> => {
//             const cropper = cropperRef.current?.cropper;
//             if (!cropper) throw new Error('Cropper not ready');
//             // Use cropper to get a canvas
//             let canvas = cropper.getCroppedCanvas({ imageSmoothingQuality: 'high' as any });
//             if (cropMode === 'face') {
//                 canvas = drawCircularFromCanvas(canvas);
//             }
//             return new Promise((resolve) => {
//                 canvas.toBlob((blob) => {
//                     if (blob) { resolve(blob); return; }
//                     canvas.toBlob((fallback) => fallback && resolve(fallback), 'image/jpeg', 1);
//                 }, mimeType, quality);
//             });
//         },
//         [cropMode],
//     );

//     const handleCropAndUpload = useCallback(async () => {
//         if (!cropperRef.current || !selectedFile) {
//             toast.error('Please select an image and crop it first');
//             return;
//         }

//         setIsUploading(true);
//         try {
//             const croppedBlob = await getCroppedImg(selectedFile.type, 1);

//             // Create a new file from the cropped blob
//             const croppedFile = new File([croppedBlob], selectedFile.name, {
//                 type: selectedFile.type,
//                 lastModified: Date.now(),
//             });

//             const formData = new FormData();
//             formData.append("file", croppedFile);

//             // Upload the cropped file
//             const url = await uploadFile(formData);

//             toast.success('Image uploaded successfully!');
//             onUploadComplete?.(url);

//             // Close dialog; on close we reset state via onOpenChange handler
//             setIsDialogOpen(false);
//         } catch (error) {
//             console.error('Upload error:', error);
//             toast.error('Failed to upload image. Please try again.');
//         } finally {
//             setIsUploading(false);
//         }
//     }, [completedCrop, selectedFile, getCroppedImg, onUploadComplete]);

//     const handleReset = useCallback(() => {
//         setSelectedFile(null);
//         setImageUrl(null);
//         setCompletedCrop(undefined);
//         setIsCropping(false);
//         setZoom(1);
//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//     }, []);

//     const handleRotate = useCallback(() => {
//         const cropper = cropperRef.current?.cropper;
//         if (cropper) cropper.rotate(90);
//     }, []);

//     const handleFileDrop = useCallback((e: React.DragEvent) => {
//         e.preventDefault();
//         const file = e.dataTransfer.files[0];
//         if (file && acceptedFileTypes.includes(file.type)) {
//             if (file.size > maxFileSize * 1024 * 1024) {
//                 toast.error(`File size must be less than ${maxFileSize}MB`);
//                 return;
//             }
//             setSelectedFile(file);
//             const url = URL.createObjectURL(file);
//             setImageUrl(url);
//             setCompletedCrop(undefined);
//             setZoom(1);
//         } else {
//             toast.error(`Please select a valid image file (${acceptedFileTypes.join(', ')})`);
//         }
//     }, [acceptedFileTypes, maxFileSize]);

//     const handleDragOver = useCallback((e: React.DragEvent) => {
//         e.preventDefault();
//     }, []);

//     // Aspect ratio for Cropper
//     const getCropAspectRatio = () => {
//         if (cropMode === 'face' || cropMode === 'square') return 1;
//         return 16 / 9;
//     };

//     // Re-center crop when switching modes
//     React.useEffect(() => {
//         const cropper = cropperRef.current?.cropper;
//         if (!cropper) return;
//         cropper.setAspectRatio(getCropAspectRatio() || NaN);
//         cropper.reset();
//         cropper.crop();
//     }, [cropMode]);

//     return (
//         <Card className={`w-full p-2 border-none shadow-none max-w-2xl mx-auto ${className}`}>
//             <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                     <Upload className="w-5 h-5" />
//                     {title}
//                     {aspectRatio === 'face' && (
//                         <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
//                             Face Crop Mode
//                         </span>
//                     )}
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4 p-0">
//                 <div
//                     className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
//                     onDrop={handleFileDrop}
//                     onDragOver={handleDragOver}
//                     onClick={() => fileInputRef.current?.click()}
//                 >
//                     <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
//                     <p className="text-lg font-medium mb-2">Drop image here or click to browse</p>
//                     <Button variant="outline" className='pointer-events-none'>
//                         Choose File
//                     </Button>
//                     <input
//                         ref={fileInputRef}
//                         type="file"
//                         accept={acceptedFileTypes.join(',')}
//                         onChange={onSelectFile}
//                         className="hidden"
//                     />
//                 </div>

//                 <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) handleReset(); }}>
//                     <DialogContent className="w-fit max-w-5xl h-fit max-h-none p-4">
//                         <div className="flex h-full flex-col">
//                             <DialogHeader className="shrink-0">
//                                 <DialogTitle>Crop Image</DialogTitle>
//                             </DialogHeader>
//                             {selectedFile && <DialogDescription>
//                                 <div className="flex items-center justify-between shrink-0">
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-sm font-medium hidden opacity-0">{selectedFile.name}</span>
//                                         <span className="text-xs text-gray-500 hidden opacity-0">
//                                             ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
//                                         </span>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <div className="items-center gap-1 sr-only hidden opacity-0">
//                                             <Button
//                                                 variant="outline"
//                                                 size="sm"
//                                                 onClick={handleZoomOut}
//                                                 disabled={isUploading || zoom <= 0.5}
//                                             >
//                                                 <ZoomOut className="w-4 h-4" />
//                                             </Button>
//                                             <span className="text-xs text-gray-500 min-w-[3rem] text-center">
//                                                 {Math.round(zoom * 100)}%
//                                             </span>
//                                             <Button
//                                                 variant="outline"
//                                                 size="sm"
//                                                 onClick={handleZoomIn}
//                                                 disabled={isUploading || zoom >= 3}
//                                             >
//                                                 <ZoomIn className="w-4 h-4" />
//                                             </Button>
//                                         </div>

//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-2 shrink-0 py-4">
//                                     {/* <span className="text-sm text-gray-600">Mode:</span> */}
//                                     <div className="flex rounded-md overflow-hidden border">
//                                         <Button type="button" variant={cropMode === 'face' ? 'default' : 'ghost'} size="sm" onClick={() => setCropMode('face')}>Round Face</Button>
//                                         <Button type="button" variant={cropMode === 'square' ? 'default' : 'ghost'} size="sm" onClick={() => setCropMode('square')}>Square</Button>
//                                         <Button type="button" variant={cropMode === 'rect' ? 'default' : 'ghost'} size="sm" onClick={() => setCropMode('rect')}>Rectangle</Button>
//                                     </div>
//                                     <Button
//                                         variant="outline"
//                                         size="sm"
//                                         onClick={handleRotate}
//                                         disabled={isUploading}
//                                     >
//                                         <RotateCcw className="w-4 h-4" />
//                                     </Button>
//                                 </div>
//                             </DialogDescription>}

//                             <div className="flex-1 relative min-h-0 max-h-[50dvh] max-w-full overflow-x-hidden overflow-y-auto">
//                                 {selectedFile && (
//                                     <div className="flex-1 min-h-0 overflow-auto flex items-center justify-center">
//                                         {imageUrl && (
//                                             <Cropper
//                                                 ref={cropperRef}
//                                                 src={imageUrl}
//                                                 controls
//                                                 className="h-full w-full"
//                                                 style={{ height: '100%', width: '100%', minHeight: 0, minWidth: 0, maxHeight: '100%', maxWidth: '100%', marginBottom: "20%" }}
//                                                 viewMode={3}
//                                                 movable={true} // means you can move the cropper to re-crop
//                                                 aspectRatio={getCropAspectRatio()}
//                                                 guides={true}
//                                                 background={false} // means no background is shown
//                                                 autoCropArea={0.9} // means the cropper will crop 90% of the image
//                                                 responsive={true} // means the cropper will be responsive
//                                                 checkOrientation={false} // means the cropper will not check the orientation of the image
//                                                 zoomOnWheel={true} // means you can zoom the cropper with the mouse wheel
//                                                 zoomTo={zoom} // means you can zoom to the zoom level you want
//                                                 ready={() => setCompletedCrop({ width: 1, height: 1 })} // means the cropper is ready to crop
//                                             />
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                         <DialogFooter className="shrink-0">
//                             <div className="text-sm text-gray-500 shrink-0">
//                                 {completedCrop && (
//                                     <span>
//                                         Crop size: {Math.round(completedCrop.width)} × {Math.round(completedCrop.height)}px
//                                         {cropMode === 'face' && ' (Circular)'}
//                                     </span>
//                                 )}
//                             </div>
//                             <div className="flex w-full justify-end gap-2">
//                                 <Button
//                                     variant="outline"
//                                     onClick={() => setIsDialogOpen(false)}
//                                     disabled={isUploading}
//                                 >
//                                     Cancel
//                                 </Button>
//                                 <Button
//                                     onClick={handleCropAndUpload}
//                                     disabled={!completedCrop || isUploading}
//                                     className="min-w-24"
//                                 >
//                                     {isUploading ? (
//                                         <div className="flex items-center gap-2">
//                                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                                             Uploading...
//                                         </div>
//                                     ) : (
//                                         <div className="flex items-center gap-2">
//                                             <Check className="w-4 h-4" />
//                                             Upload
//                                         </div>
//                                     )}
//                                 </Button>
//                             </div>
//                         </DialogFooter>
//                     </DialogContent>

//                 </Dialog>
//             </CardContent>
//         </Card>
//     );
// }








'use client';

import React, { useState, useRef, useCallback } from 'react';
import 'cropperjs/dist/cropper.css';
import Cropper, { ReactCropperElement } from 'react-cropper';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Upload, X, RotateCcw, Check, ZoomIn, ZoomOut, ImageIcon } from 'lucide-react';
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

// Utilities for circular export when in face mode
function drawCircularFromCanvas(source: HTMLCanvasElement): HTMLCanvasElement {
    const size = Math.min(source.width, source.height);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return source;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    const offsetX = (size - source.width) / 2;
    const offsetY = (size - source.height) / 2;
    ctx.drawImage(source, offsetX, offsetY);
    ctx.restore();
    return canvas;
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
    const cropperRef = useRef<ReactCropperElement>(null);
    const [completedCrop, setCompletedCrop] = useState<{ width: number; height: number }>();
    const [isUploading, setIsUploading] = useState(false);
    const [_, setIsCropping] = useState(false);
    const [zoom, setZoom] = useState(1);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [cropMode, setCropMode] = useState<'face' | 'square' | 'rect' | 'free'>(() => {
        if (aspectRatio === 'face') return 'face';
        if (typeof aspectRatio === 'number') return aspectRatio === 1 ? 'square' : 'rect';
        return 'free';
    });

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
        setCompletedCrop(undefined);
        setZoom(1); // Reset zoom when new image is selected
        setIsDialogOpen(true);
    }, [acceptedFileTypes, maxFileSize]);

    const onImageLoad = useCallback((_e: React.SyntheticEvent<HTMLImageElement>) => {
        // Cropper will handle initialization; nothing needed here
    }, []);

    const handleZoomIn = useCallback(() => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            cropper.zoom(0.1);
        }
    }, []);

    const handleZoomOut = useCallback(() => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            cropper.zoom(-0.1);
        }
    }, []);

    const getCroppedImg = useCallback(
        (mimeType: string, quality: number = 1): Promise<Blob> => {
            const cropper = cropperRef.current?.cropper;
            if (!cropper) throw new Error('Cropper not ready');
            // Use cropper to get a canvas
            let canvas = cropper.getCroppedCanvas({
                imageSmoothingQuality: 'high' as any,
                maxWidth: 2048,
                maxHeight: 2048
            });
            if (cropMode === 'face') {
                canvas = drawCircularFromCanvas(canvas);
            }
            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    if (blob) { resolve(blob); return; }
                    canvas.toBlob((fallback) => fallback && resolve(fallback), 'image/jpeg', 1);
                }, mimeType, quality);
            });
        },
        [cropMode],
    );

    const handleCropAndUpload = useCallback(async () => {
        if (!cropperRef.current || !selectedFile) {
            toast.error('Please select an image and crop it first');
            return;
        }

        setIsUploading(true);
        try {
            const croppedBlob = await getCroppedImg(selectedFile.type, 1);

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

            // Close dialog; on close we reset state via onOpenChange handler
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    }, [selectedFile, getCroppedImg, onUploadComplete]);

    const handleReset = useCallback(() => {
        setSelectedFile(null);
        setImageUrl(null);
        setCompletedCrop(undefined);
        setIsCropping(false);
        setZoom(1);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const handleRotate = useCallback(() => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) cropper.rotate(90);
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
            setCompletedCrop(undefined);
            setZoom(1);
            setIsDialogOpen(true);
        } else {
            toast.error(`Please select a valid image file (${acceptedFileTypes.join(', ')})`);
        }
    }, [acceptedFileTypes, maxFileSize]);

    const handleChangeImage = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    // Aspect ratio for Cropper
    const getCropAspectRatio = () => {
        if (cropMode === 'face' || cropMode === 'square') return 1;
        if (cropMode === 'rect') return 16 / 9;
        return NaN; // Free mode - no aspect ratio constraint
    };

    // Re-center crop when switching modes
    React.useEffect(() => {
        const cropper = cropperRef.current?.cropper;
        if (!cropper) return;

        // Small delay to ensure cropper is ready
        setTimeout(() => {
            cropper.setAspectRatio(getCropAspectRatio() || NaN);
            cropper.reset();
            cropper.crop();
        }, 100);
    }, [cropMode]);

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
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">Drop image here or click to browse</p>
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

                <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) handleReset(); }}>
                    <DialogContent className="max-w-4xl max-h-[90vh] w-[90vw] p-0 overflow-hidden flex flex-col">
                        <DialogHeader className="p-6 pb-2 flex-shrink-0">
                            <DialogTitle>Crop Image</DialogTitle>
                            {selectedFile && (
                                <DialogDescription>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{selectedFile.name}</span>
                                            <span className="text-xs text-gray-500">
                                                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleZoomOut}
                                                disabled={isUploading}
                                            >
                                                <ZoomOut className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleZoomIn}
                                                disabled={isUploading}
                                            >
                                                <ZoomIn className="w-4 h-4" />
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
                                                        <Upload className="w-4 h-4" />
                                                        Upload
                                                    </div>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4">
                                        <div className="flex rounded-md overflow-hidden border">
                                            <Button
                                                type="button"
                                                variant={cropMode === 'face' ? 'default' : 'ghost'}
                                                size="sm"
                                                onClick={() => setCropMode('face')}
                                            >
                                                Round Face
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={cropMode === 'square' ? 'default' : 'ghost'}
                                                size="sm"
                                                onClick={() => setCropMode('square')}
                                            >
                                                Square
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={cropMode === 'rect' ? 'default' : 'ghost'}
                                                size="sm"
                                                onClick={() => setCropMode('rect')}
                                            >
                                                Rectangle
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={cropMode === 'free' ? 'default' : 'ghost'}
                                                size="sm"
                                                onClick={() => setCropMode('free')}
                                            >
                                                Free
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
                                            onClick={handleChangeImage}
                                            disabled={isUploading}
                                        >
                                            <ImageIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </DialogDescription>
                            )}
                        </DialogHeader>

                        <div className="flex-1 min-h-0 p-6 pt-2">
                            {selectedFile && imageUrl && (
                                <div className="w-full h-full max-h-[500px] relative">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept={acceptedFileTypes.join(',')}
                                        onChange={onSelectFile}
                                        className="hidden"
                                    />
                                    <Cropper
                                        ref={cropperRef}
                                        src={imageUrl}
                                        className="w-full h-full"
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            maxHeight: '500px'
                                        }}
                                        // Key cropper options for proper display
                                        viewMode={1} // Restrict crop box to not exceed canvas
                                        dragMode="move"
                                        aspectRatio={getCropAspectRatio()}
                                        autoCropArea={0.8}
                                        responsive={true}
                                        restore={false}
                                        guides={true}
                                        center={true}
                                        highlight={false}
                                        cropBoxMovable={true}
                                        cropBoxResizable={true}
                                        toggleDragModeOnDblclick={false}
                                        // Zoom and pan controls
                                        zoomable={true}
                                        zoomOnTouch={true}
                                        zoomOnWheel={true}
                                        wheelZoomRatio={0.1}
                                        // Ensure image fits properly
                                        checkOrientation={false}
                                        modal={true}
                                        background={true}
                                        // Event handlers
                                        ready={() => {
                                            const cropper = cropperRef.current?.cropper;
                                            if (cropper) {
                                                // Ensure the image is properly fitted
                                                cropper.reset();
                                                setCompletedCrop({ width: 1, height: 1 });
                                            }
                                        }}
                                        cropend={() => {
                                            const cropper = cropperRef.current?.cropper;
                                            if (cropper) {
                                                const cropData = cropper.getCropBoxData();
                                                setCompletedCrop({
                                                    width: cropData.width,
                                                    height: cropData.height
                                                });
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <DialogFooter className="p-6 pt-2 flex-shrink-0">
                            <div className="flex items-center justify-between w-full">
                                <div className="text-sm text-gray-500">
                                    {completedCrop && (
                                        <span>
                                            Crop size: {Math.round(completedCrop.width)} × {Math.round(completedCrop.height)}px
                                            {cropMode === 'face' && ' (Circular)'}
                                            {cropMode === 'free' && ' (Free form)'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
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
                                                <Upload className="w-4 h-4" />
                                                Upload
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}