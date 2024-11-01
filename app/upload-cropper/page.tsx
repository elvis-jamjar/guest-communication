'use client';
import ImageCropper from "../../components/ImageCropper";

export default function Page() {

    return (
        <div className="w-full h-screen">
            <ImageCropper
                btnTitle="Upload Image"
                onCompleteUpload={(url) => {
                    // do something with the url
                }} />
        </div>

    )
}