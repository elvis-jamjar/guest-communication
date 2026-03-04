'use client';
import ImageCropper from "../../components/ImageCropper";

export default function Page() {

    return (
        <div className="w-full h-screen">
            <ImageCropper
                btnTitle="Upload Image"
                onCompleteUpload={() => {
                    // do something with the url when upload completes
                }} />
        </div>

    )
}