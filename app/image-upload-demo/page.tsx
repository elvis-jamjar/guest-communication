'use client';

import { ImageUploadWithCropper } from '@/components/ImageUploadWithCropper';

export default function ImageUploadDemoPage() {
    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Image Upload with Cropper Demo</h1>
                <p className="text-gray-600 mb-8">
                    Test the enhanced image cropper with face cropping and zoom controls
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Free aspect ratio cropper */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-center">Free Aspect Ratio</h2>
                    <ImageUploadWithCropper
                        title="Free Crop"
                        onUploadComplete={(url) => console.log('Uploaded:', url)}
                    />
                </div>

                {/* Face cropping cropper */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-center">Face Cropping (Circular)</h2>
                    <ImageUploadWithCropper
                        title="Face Crop"
                        aspectRatio="face"
                        onUploadComplete={(url) => console.log('Face crop uploaded:', url)}
                    />
                </div>

                {/* 16:9 aspect ratio cropper */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-center">16:9 Aspect Ratio</h2>
                    <ImageUploadWithCropper
                        title="16:9 Crop"
                        aspectRatio={16 / 9}
                        onUploadComplete={(url) => console.log('16:9 uploaded:', url)}
                    />
                </div>

                {/* 1:1 (square) aspect ratio cropper */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-center">1:1 Square Crop</h2>
                    <ImageUploadWithCropper
                        title="Square Crop"
                        aspectRatio={1}
                        onUploadComplete={(url) => console.log('Square uploaded:', url)}
                    />
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">New Features Added:</h3>
                <ul className="space-y-2 text-blue-700">
                    <li>• <strong>Face Cropping:</strong> Set <code>aspectRatio=&quot;face&quot;</code> for circular face crops</li>
                    <li>• <strong>Zoom Controls:</strong> Zoom in/out buttons with visual zoom percentage display</li>
                    <li>• <strong>Enhanced UI:</strong> Face crop mode indicator and circular crop visualization</li>
                    <li>• <strong>Smart Cropping:</strong> Face crops automatically center and size appropriately</li>
                </ul>
            </div>
        </div>
    );
}
