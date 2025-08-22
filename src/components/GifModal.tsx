import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, User, Calendar, Eye } from "lucide-react";
import { GifData } from "./GifCard";

interface GifModalProps {
  gif: GifData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GifModal = ({ gif, isOpen, onClose }: GifModalProps) => {
  if (!gif) return null;

  const handleDownload = async () => {
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

  const handleOpenOriginal = () => {
    window.open(gif.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {gif.title || 'GIF sin título'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* GIF Display */}
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-muted/20">
              <img
                src={gif.images.original.url}
                alt={gif.title}
                className="w-full h-auto max-h-96 object-contain mx-auto"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleDownload}
                className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar GIF
              </Button>
              <Button
                variant="outline"
                onClick={handleOpenOriginal}
                className="border-primary/30 hover:bg-primary/10"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* User Info */}
            {gif.user && (
              <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                  <User className="w-5 h-5 text-primary" />
                  Creado por
                </h3>
                <div className="flex items-start gap-3">
                  {gif.user.avatar_url && (
                    <img
                      src={gif.user.avatar_url}
                      alt={gif.user.display_name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-foreground">
                      {gif.user.display_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @{gif.user.username}
                    </p>
                    {gif.user.profile_url && (
                      <Button
                        variant="link"
                        className="h-auto p-0 text-primary hover:text-primary-glow"
                        onClick={() => window.open(gif.user!.profile_url, '_blank')}
                      >
                        Ver perfil
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* GIF Info */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Eye className="w-5 h-5 text-primary" />
                Información del GIF
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Dimensiones</p>
                  <p className="font-medium">
                    {gif.images.original.width} × {gif.images.original.height}px
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">ID</p>
                  <p className="font-mono text-xs break-all">{gif.id}</p>
                </div>
              </div>

              {gif.title && (
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Título completo</p>
                  <p className="text-sm leading-relaxed bg-muted/20 p-3 rounded-lg">
                    {gif.title}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-gradient-secondary text-white">
                  GIF
                </Badge>
                {gif.user && (
                  <Badge variant="outline" className="border-primary/30">
                    Usuario verificado
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};