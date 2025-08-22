import { GifCard, GifData } from "./GifCard";

interface GifGridProps {
  gifs: GifData[];
  onGifClick: (gif: GifData) => void;
  isLoading?: boolean;
}

export const GifGrid = ({ gifs, onGifClick, isLoading = false }: GifGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-muted/20 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (gifs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">No se encontraron resultados</h3>
        <p className="text-muted-foreground max-w-md">
          Intenta con diferentes palabras clave o explora los GIFs más populares.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {gifs.map((gif) => (
        <GifCard
          key={gif.id}
          gif={gif}
          onViewDetails={onGifClick}
        />
      ))}
    </div>
  );
};