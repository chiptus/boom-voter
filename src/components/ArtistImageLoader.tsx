
import { useState } from "react";
import { Music } from "lucide-react";

interface ArtistImageLoaderProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export const ArtistImageLoader = ({ src, alt, className = "" }: ArtistImageLoaderProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (!src || imageError) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 ${className}`}>
        <Music className="h-16 w-16 text-white/70" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
      <img 
        src={src} 
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};
