import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, ExternalLink, Eye, EyeOff } from "lucide-react";
import { setGiphyApiKey, getGiphyApiKey } from "@/services/giphyApi";

interface ApiKeyInputProps {
  onApiKeySet: () => void;
}

export const ApiKeyInput = ({ onApiKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('giphy_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setGiphyApiKey(savedKey);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('giphy_api_key', apiKey.trim());
      setGiphyApiKey(apiKey.trim());
      onApiKeySet();
    }
  };

  const handleGetApiKey = () => {
    window.open('https://developers.giphy.com/dashboard/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            GIF Explorer Hub
          </CardTitle>
          <CardDescription className="text-base">
            Ingresa tu API key de GIPHY para comenzar a explorar GIFs increíbles
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showApiKey ? "text" : "password"}
                placeholder="Tu API key de GIPHY"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-12 bg-background/50"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
              disabled={!apiKey.trim()}
            >
              Comenzar a explorar
            </Button>
          </form>

          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">¿No tienes una API key?</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleGetApiKey}
              className="w-full border-primary/30 hover:bg-primary/10"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Obtener API key gratuita
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-2">
            <p>
              <strong>Nota:</strong> Tu API key se guarda localmente en tu navegador y nunca se envía a nuestros servidores.
            </p>
            <p>
              La API key gratuita de GIPHY te permite realizar hasta 1000 búsquedas por día.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};