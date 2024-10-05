"use client"
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface DynamicImageProps {
  src: string;
  alt: string;
}
export const DynamicImage: React.FC<DynamicImageProps> = ({ src, alt }) => {
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(
    { width: 0, height: 0 }
  );

  useEffect(() => {
    const img = new window.Image(); // Explicitly using window.Image to avoid SSR issues
    img.src = src;
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
  }, [src]);

  return (
    <div className="image-container">
      {imageSize.width && imageSize.height ? (
        <Image
          src={src}
          alt={alt}
          width={imageSize.width}
          height={imageSize.height}
          objectFit="cover"
          layout="intrinsic"
          className='rounded-md w-24'
        />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
};
