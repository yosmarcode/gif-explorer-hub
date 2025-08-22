import { GifData } from "@/components/GifCard";

// NOTA: Nunca subas tu API key real al código fuente
// Esta es solo para demostración - usa variables de entorno en producción
let GIPHY_API_KEY = 'demo_api_key'; // Placeholder

interface GiphyResponse {
  data: any[];
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
}

interface SearchParams {
  q: string;
  limit?: number;
  offset?: number;
  rating?: 'g' | 'pg' | 'pg-13' | 'r';
  lang?: string;
}

export const setGiphyApiKey = (apiKey: string) => {
  GIPHY_API_KEY = apiKey;
};

export const getGiphyApiKey = () => GIPHY_API_KEY;

const transformGiphyData = (giphyGif: any): GifData => {
  return {
    id: giphyGif.id,
    title: giphyGif.title,
    images: {
      original: {
        url: giphyGif.images.original.url,
        width: giphyGif.images.original.width,
        height: giphyGif.images.original.height,
      },
      fixed_width: {
        url: giphyGif.images.fixed_width.url,
        width: giphyGif.images.fixed_width.width,
        height: giphyGif.images.fixed_width.height,
      },
      downsized_medium: {
        url: giphyGif.images.downsized_medium?.url || giphyGif.images.original.url,
        width: giphyGif.images.downsized_medium?.width || giphyGif.images.original.width,
        height: giphyGif.images.downsized_medium?.height || giphyGif.images.original.height,
      },
    },
    user: giphyGif.user ? {
      display_name: giphyGif.user.display_name,
      username: giphyGif.user.username,
      avatar_url: giphyGif.user.avatar_url,
      profile_url: giphyGif.user.profile_url,
    } : undefined,
    url: giphyGif.url,
  };
};

export const searchGifs = async (params: SearchParams): Promise<{ gifs: GifData[], totalCount: number }> => {
  if (GIPHY_API_KEY === 'demo_api_key') {
    throw new Error('API_KEY_REQUIRED');
  }

  const { q, limit = 25, offset = 0, rating = 'g', lang = 'es' } = params;
  
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}&rating=${rating}&lang=${lang}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: GiphyResponse = await response.json();
    
    return {
      gifs: data.data.map(transformGiphyData),
      totalCount: data.pagination.total_count
    };
  } catch (error) {
    console.error('Error searching GIFs:', error);
    throw error;
  }
};

export const getTrendingGifs = async (limit: number = 25): Promise<GifData[]> => {
  if (GIPHY_API_KEY === 'demo_api_key') {
    throw new Error('API_KEY_REQUIRED');
  }

  const url = `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=${limit}&rating=g`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: GiphyResponse = await response.json();
    
    return data.data.map(transformGiphyData);
  } catch (error) {
    console.error('Error fetching trending GIFs:', error);
    throw error;
  }
};