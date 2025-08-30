
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type NoteImageProps = {
  src?: string;
  alt: string;
  fallbackIcon: React.ReactNode;
};

export function NoteImage({ src, alt, fallbackIcon }: NoteImageProps) {
  const [error, setError] = useState(false);

  // Reset error state if the src changes
  useEffect(() => {
    setError(false);
  }, [src]);
  
  if (!src || error) {
    return <>{fallbackIcon}</>;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      data-ai-hint="note education"
      onError={() => setError(true)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
