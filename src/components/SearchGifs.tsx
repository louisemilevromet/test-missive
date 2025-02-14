import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Gif } from "@/types/Gif";

const SearchGifs = ({
  onGifSelected,
}: {
  onGifSelected: (gif: Gif) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredGif, setHoveredGif] = useState<Gif | null>(null);

  useEffect(() => {
    const fetchGifs = async () => {
      try {
        setIsLoading(true);
        if (!searchTerm) {
          setGifs([]);
          return;
        }

        const response = await fetch(
          `https://tenor.googleapis.com/v2/search?q=${searchTerm}&key=AIzaSyDEQh0Zq--gZUkLas23YU5FHmceuUG8zbw`
        );
        const data = await response.json();

        setGifs(data.results);
      } catch (error) {
        console.error("Error fetching gifs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fake way of debouncing the search, with a 500ms delay
    const timer = setTimeout(fetchGifs, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="max-w-[1082px] mx-auto px-8 pt-8 pb-24">
      <h1 className="text-2xl font-bold mb-4">Gif Search</h1>
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder="Search for gifs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
        {gifs.map((gif) => (
          <div
            key={gif.id}
            className="border rounded-lg flex flex-col items-center cursor-pointer relative"
            onMouseEnter={() => setHoveredGif(gif)}
            onMouseLeave={() => setHoveredGif(null)}
          >
            {hoveredGif === gif && (
              <button
                className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium hover:bg-black/60 transition-colors"
                onClick={() => onGifSelected(gif)}
              >
                Send this GIF
              </button>
            )}
            {isLoading ? (
              <div className="w-full h-48 flex items-center justify-center">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : (
              <img
                src={gif.media_formats?.gif?.url || "/placeholder.svg"}
                alt={gif.content_description || "Gif"}
                className="w-full h-48 object-cover rounded"
              />
            )}
          </div>
        ))}
      </div>
      {gifs.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No gifs found 😔</p>
      )}
    </div>
  );
};

export default SearchGifs;
