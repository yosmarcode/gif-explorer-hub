import { useState, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { GifGrid } from "@/components/GifGrid";
import { GifModal } from "@/components/GifModal";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { GifData } from "@/components/GifCard";
import { searchGifs, getTrendingGifs, getGiphyApiKey } from "@/services/giphyApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Zap, TrendingUp, Sparkles } from "lucide-react";

const Index = () => {
  const [gifs, setGifs] = useState<GifData[]>([]);
  const [selectedGif, setSelectedGif] = useState<GifData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem('giphy_api_key');
    if (savedKey) {
      setHasApiKey(true);
      loadTrendingGifs();
    }
  }, []);

  const loadTrendingGifs = async () => {
    setIsLoading(true);
    try {
      const trendingGifs = await getTrendingGifs(25);
      setGifs(trendingGifs);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los GIFs trending",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    try {
      const result = await searchGifs({ q: query, limit: 25 });
      setGifs(result.gifs);
      
      if (result.gifs.length === 0) {
        toast({
          title: "Sin resultados",
          description: `No se encontraron GIFs para "${query}"`,
        });
      }
    } catch (error: any) {
      if (error.message === 'API_KEY_REQUIRED') {
        toast({
          title: "API Key requerida",
          description: "Por favor, ingresa tu API key de GIPHY",
          variant: "destructive",
        });
        setHasApiKey(false);
      } else {
        toast({
          title: "Error de búsqueda",
          description: "Ocurrió un error al buscar GIFs. Intenta de nuevo.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySet = () => {
    setHasApiKey(true);
    loadTrendingGifs();
    toast({
      title: "¡Perfecto!",
      description: "API key configurada correctamente. ¡Comencemos a explorar!",
    });
  };

  if (!hasApiKey) {
    return <ApiKeyInput onApiKeySet={handleApiKeySet} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-rainbow opacity-10" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center space-y-6 mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                GIF Explorer Hub
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubre, explora y descarga los mejores GIFs, stickers y videos de GIPHY
            </p>
            
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={loadTrendingGifs}
              className="border-primary/30 hover:bg-primary/10"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSearch("funny")}
              className="border-gif-pink/30 hover:bg-gif-pink/10"
            >
              😂 Divertidos
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSearch("reaction")}
              className="border-gif-blue/30 hover:bg-gif-blue/10"
            >
              🎭 Reacciones
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSearch("animals")}
              className="border-gif-cyan/30 hover:bg-gif-cyan/10"
            >
              🐾 Animales
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 pb-16">
        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Resultados para: <span className="text-primary">"{searchQuery}"</span>
            </h2>
            <div className="h-1 w-20 bg-gradient-primary rounded-full" />
          </div>
        )}

        <GifGrid
          gifs={gifs}
          onGifClick={setSelectedGif}
          isLoading={isLoading}
        />

        {!isLoading && gifs.length === 0 && !searchQuery && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold mb-2">¡Comienza a explorar!</h3>
            <p className="text-muted-foreground">
              Busca algo increíble o explora los GIFs más populares
            </p>
          </div>
        )}
      </div>

      <GifModal
        gif={selectedGif}
        isOpen={!!selectedGif}
        onClose={() => setSelectedGif(null)}
      />
    </div>
  );
};

export default Index;
