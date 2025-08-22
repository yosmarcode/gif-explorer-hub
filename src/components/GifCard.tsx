import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, User, Eye } from "lucide-react";

export interface GifData {
  id: string;
  title: string;
  images: {
    original: {
      url: string;
      width: string;
      height: string;
    };
    fixed_width: {
      url: string;
      width: string;
      height: string;
    };
    downsized_medium: {
      url: string;
      width: string;
      height: string;
    };
  };
  user?: {
    display_name: string;
    username: string;
    avatar_url: string;
    profile_url: string;
  };
  url: string;
}

interface GifCardProps {
  gif: GifData;
  onViewDetails: (gif: GifData) => void;
}

export const GifCard = ({ gif, onViewDetails }: GifCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(gif.images.original.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${gif.title || 'gif'}-${gif.id}.gif`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading GIF:', error);
    }
  };

  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer bg-card/30 border-border/30 
               hover:bg-card/50 transition-all duration-300 hover:shadow-card hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(gif)}
    >
      <div className="relative aspect-square">
        <img
          src={gif.images.fixed_width.url}
          alt={gif.title}
          className={`w-full h-full object-cover transition-all duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
        />
        
        {!isLoaded && (
          <div className="absolute inset-0 bg-muted/20 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {/* Overlay with actions */}
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="sm"
              onClick={handleDownload}
              className="bg-black/50 hover:bg-black/70 text-white border-0 h-8 w-8 p-0 
                       backdrop-blur-sm transition-all duration-200 hover:scale-110"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>

          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex items-center justify-between">
              {gif.user && (
                <div className="flex items-center gap-2 bg-black/50 rounded-lg px-2 py-1 backdrop-blur-sm">
                  <User className="w-3 h-3 text-white/80" />
                  <span className="text-xs text-white/90 truncate max-w-20">
                    {gif.user.display_name || gif.user.username}
                  </span>
                </div>
              )}
              
              <Button
                size="sm"
                className="bg-gradient-primary hover:shadow-glow text-white border-0 h-7 px-3 
                         transition-all duration-200 hover:scale-105"
              >
                <Eye className="w-3 h-3 mr-1" />
                Ver
              </Button>
            </div>
          </div>
        </div>
      </div>

      {gif.title && (
        <div className="p-3">
          <p className="text-sm text-foreground/80 truncate font-medium">
            {gif.title}
          </p>
        </div>
      )}
    </Card>
  );
};