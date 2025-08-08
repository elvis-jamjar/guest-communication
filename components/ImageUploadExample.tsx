'use client';

import { ImageUploadWithCropper } from './ImageUploadWithCropper';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function ImageUploadExample() {
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);
    const [galleryImages, setGalleryImages] = useState<string[]>([]);

    const handleProfileUpload = (url: string) => {
        setProfileImageUrl(url);
    };

    const handleBannerUpload = (url: string) => {
        setBannerImageUrl(url);
    };

    const handleGalleryUpload = (url: string) => {
        setGalleryImages(prev => [...prev, url]);
    };

    return (
        <div className="space-y-6">
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">Profile Image</TabsTrigger>
                    <TabsTrigger value="banner">Banner Image</TabsTrigger>
                    <TabsTrigger value="gallery">Gallery</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Image Upload (1:1 Aspect Ratio)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ImageUploadWithCropper
                                    onUploadComplete={handleProfileUpload}
                                    aspectRatio={1}
                                    maxFileSize={2}
                                    acceptedFileTypes={['image/jpeg', 'image/png']}
                                />
                                {profileImageUrl && (
                                    <div className="space-y-4">
                                        <h3 className="font-medium">Uploaded Profile Image:</h3>
                                        <img
                                            src={profileImageUrl}
                                            alt="Profile"
                                            className="w-32 h-32 rounded-full object-cover border"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="banner" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Banner Image Upload (16:9 Aspect Ratio)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ImageUploadWithCropper
                                    onUploadComplete={handleBannerUpload}
                                    aspectRatio={16 / 9}
                                    maxFileSize={5}
                                    acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                                />
                                {bannerImageUrl && (
                                    <div className="space-y-4">
                                        <h3 className="font-medium">Uploaded Banner Image:</h3>
                                        <img
                                            src={bannerImageUrl}
                                            alt="Banner"
                                            className="w-full h-32 object-cover rounded-lg border"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="gallery" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gallery Images (Free Aspect Ratio)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <ImageUploadWithCropper
                                    onUploadComplete={handleGalleryUpload}
                                    aspectRatio={undefined}
                                    maxFileSize={10}
                                    acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                                />

                                {galleryImages.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="font-medium">Uploaded Gallery Images:</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {galleryImages.map((url, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={url}
                                                        alt={`Gallery ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg border"
                                                    />
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== index))}
                                                    >
                                                        ×
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
