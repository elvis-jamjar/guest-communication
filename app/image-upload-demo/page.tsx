'use client';

import { ImageUploadWithCropper } from '@/components/ImageUploadWithCropper';
import { ImageUploadExample } from '@/components/ImageUploadExample';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ImageUploadDemo() {
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

    const handleUploadComplete = (url: string) => {
        setUploadedUrl(url);
    };

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Image Upload with Cropper Demo</h1>
                <p className="text-gray-600 max-w-4xl mx-auto">
                    This demo shows how to use the ImageUploadWithCropper component.
                    Upload an image, crop it to your desired size, and then upload it to the server.
                    The component integrates with your existing uploadFile server action.
                </p>
            </div>

            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Example</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced Examples</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <ImageUploadWithCropper
                                onUploadComplete={handleUploadComplete}
                                aspectRatio={16 / 9}
                                maxFileSize={5}
                                acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                            />
                        </div>

                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Uploaded Image</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {uploadedUrl ? (
                                        <div className="space-y-4">
                                            <img
                                                src={uploadedUrl}
                                                alt="Uploaded"
                                                className="w-full h-auto rounded-lg border"
                                            />
                                            <div className="text-sm text-gray-600">
                                                <p><strong>URL:</strong></p>
                                                <p className="break-all bg-gray-100 p-2 rounded text-xs">
                                                    {uploadedUrl}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>No image uploaded yet</p>
                                            <p className="text-sm">Upload and crop an image to see it here</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Features</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm">
                                        <li>• Drag & drop or click to select images</li>
                                        <li>• Interactive cropping with aspect ratio control</li>
                                        <li>• Image rotation support</li>
                                        <li>• File type and size validation</li>
                                        <li>• Real-time crop size display</li>
                                        <li>• Loading states and error handling</li>
                                        <li>• Responsive design</li>
                                        <li>• Uses your existing uploadFile server action</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-8">
                    <ImageUploadExample />
                </TabsContent>
            </Tabs>
        </div>
    );
}
