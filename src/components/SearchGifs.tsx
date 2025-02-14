"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import keyword_extractor from "keyword-extractor";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { Gif } from "@/types/Gif";

const SearchGifs = ({
  onGifSelected,
  conversation,
}: {
  onGifSelected: (gif: Gif) => void;
  conversation: {
    subject: string;
  };
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
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
          `https://tenor.googleapis.com/v2/search?q=${searchTerm}&key=${
            import.meta.env.VITE_TENOR_APIKEY
          }`
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

  const handleAnalyseContent = async () => {
    try {
      setIsLoading2(true);
      if (!conversation || !conversation.subject) return;

      // Extract keywords from the conversation subject.
      const keywords = keyword_extractor.extract(conversation.subject, {
        language: "english", // Change if needed (e.g., "french")
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
      });

      // Use the first 2-3 keywords to create a summary string
      const summary = keywords.slice(0, 3).join(" ");
      setSearchTerm(summary);
    } catch (error) {
      console.log("Error fetching conversation:", error);
    } finally {
      setIsLoading2(false);
    }
  };

  return (
    <div className="max-w-[1082px] mx-auto px-8 pt-8 pb-24">
      <h1 className="text-2xl font-bold mb-4">Gif Search</h1>
      <div className="flex gap-4 mb-6">
        <div className="relative flex-grow">
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleAnalyseContent} disabled={!conversation}>
                {isLoading2 ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Analyse"
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                This button analyzes the conversation you're on and proposes
                GIFs based on the subject.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
