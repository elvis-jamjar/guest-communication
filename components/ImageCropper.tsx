'use client';;
import getCroppedImg from '@/lib/cropImage'; // Helper function for cropping
import { useUploadThing } from '@/lib/uploadThing';
import React, { useCallback, useRef, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Button } from './ui/button';
import { SheetComponent } from './ui/sheet';

interface ImageCropperProps {
    onCompleteUpload: (url: string) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ onCompleteUpload }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
    const cropRef = useRef<HTMLDivElement | null>(null);
    const [progress, setProgress] = useState(0);
    const [onOpenSheet, setOnOpenSheet] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    // const [file, setFile] = useState<File | undefined>();
    const { startUpload, isUploading } = useUploadThing("imageUploader", {
        onClientUploadComplete: (res) => {
            // alert(`uploaded successfully! ${res.at(0)?.url}`);
            // setRemoteUrl(res.at(0)?.url || '');
            onCompleteUpload(res?.at(0)?.url || '');
            // close
            setOnOpenSheet(false)
        },
        onUploadError: () => {
            alert("error occurred while uploading");
            // setUploadMessage("error occurred while uploading");
        },
        onUploadBegin: (fn) => {
            console.log("upload has begun for", fn);
            // setUploadMessage("upload has begun...");
        },
        onUploadProgress: (progress) => {
            setProgress(progress);
            console.log("upload progress for", progress);
            // setUploadMessage(`upload... ${progress}%`);
        }
    });

    //handle file data
    const onCropCompleteHandler = useCallback(async () => {
        if (croppedAreaPixels && imageSrc) {
            try {
                const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels as Area);
                const file = new File([croppedImageBlob], 'cropped-image.png', { type: 'image/png' });
                // onCropComplete(file); // Pass the File object back to parent component
                await startUpload([file]);
            } catch (error) {
                console.error('Error cropping image:', error);
            }
        }
    }, [imageSrc, croppedAreaPixels]);

    // const downloadCroppedImage = async () => {
    //     if (!croppedAreaPixels) return;
    //     try {
    //         const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    //         if (croppedImage) {
    //             saveAs(croppedImage, 'cropped-image.jpg');
    //         }
    //     } catch (error) {
    //         console.error('Failed to download cropped image', error);
    //     }
    // };

    return (
        <div className="flex flex-col w-full items-center justify-center p-4">
            <div className="flex justify-start w-full">
                <Button
                    disabled={isUploading}
                    size={"sm"}
                    className='bg-secondary-main text-white hover:bg-secondary-main/95' onClick={() => imageInputRef.current?.click()}>Upload speaker photo</Button>
                <input
                    ref={imageInputRef}
                    className="border hidden border-gray-300 p-5"
                    type="file" onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                            setImageSrc(URL.createObjectURL(file));
                            setOnOpenSheet(true);
                            // setFile(file);
                        }
                    }} />
            </div>
            <SheetComponent
                isOpen={onOpenSheet && !!imageSrc}
                onClose={() => setOnOpenSheet(false)}
                side='left'>
                <div className='flex flex-row-reverse gap-5'>
                    <div className='space-y-8'>
                        <label className="flex items-center">
                            Zoom:
                            <input
                                type="range"
                                min="0.5"
                                max="3"
                                step="0.1"
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="ml-2"
                            />
                        </label>
                        <div className='flex justify-center w-full'>
                            <Button
                                disabled={isUploading}
                                size={"lg"}
                                className='bg-secondary-main w-full text-white hover:bg-secondary-main/95' onClick={onCropCompleteHandler}>
                                {isUploading ? `Uploading ${progress}%`
                                    : "Upload"}
                            </Button>
                        </div>
                    </div>
                    <div className='flex-col w-full'>
                        <div ref={cropRef} className="relative w-full h-[600px] bg-white justify-center">
                            {!!imageSrc && <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                cropShape='round'
                                aspect={1}
                                minZoom={0.5}
                                maxZoom={3}
                                objectFit='contain'
                                restrictPosition={false}
                                cropSize={{ width: 400, height: 400 }}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                            />}
                        </div>
                    </div>
                </div>

            </SheetComponent>

        </div>
    );
};

export default ImageCropper;
