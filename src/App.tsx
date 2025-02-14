import SearchGifs from "@/components/SearchGifs";
import Footer from "@/components/Footer";
import { Gif } from "@/types/Gif";

import { useState, useEffect } from "react";

const App = () => {
  const [conversation, setConversation] = useState({subject: ""});

  // Feature 1 & 4: Send a gif to the comment box, if there is no active conversation, create one
  const handleGifSelection = (gif: Gif) => {
    const activeConversation =
      Missive.state.conversations && Missive.state.conversations.length > 0;
    if (activeConversation) {
      const gifUrl = gif.media_formats?.gif?.url;
      if (gifUrl) {
        Missive.comment(gifUrl);
      }
    } else {
      Missive.createConversation({ select: true, count: 1 });
      const gifUrl = gif.media_formats?.gif?.url;
      if (gifUrl) {
        Missive.comment(gifUrl);
      }
    }
  };

  // Feature 2: Open the Gif panel when the user clicks opt + command + n
  Missive.on("main_action", () => {
    Missive.openSelf();
    Missive.closeSelf();
  });

  // Feature 3: Add Gifs to the draft with context menu
  Missive.setActions([
    {
      // Open the Gif panel
      contexts: ["comment_box"],
      label: "Add a GIF in the comment box",
      callback: () => {
        Missive.openSelf();
      },
    },
    {
      // Respond with a random 👍 GIF
      contexts: ["draft"],
      label: "Respond with a random 👍 GIF",
      callback: async () => {
        try {
          const response = await fetch(
            `https://tenor.googleapis.com/v2/search?q=thumbs+up&key=${
              import.meta.env.VITE_TENOR_APIKEY
            }`
          );
          const data = await response.json();
          const results = data.results;

          if (results.length > 0) {
            const randomIndex = Math.floor(Math.random() * results.length);
            Missive.reply({
              mailto: {
                body: `<img src="${results[randomIndex].media_formats.gif.url}" />`,
              },
            });
          }
        } catch (error) {
          console.error(error);
        }
      },
    },
    {
      // Respond with a random GIF
      contexts: ["draft"],
      label: "Respond with a random GIF",
      callback: async () => {
        const response = await fetch(
          `https://tenor.googleapis.com/v2/search?q=thumbs+down&key=${
            import.meta.env.VITE_TENOR_APIKEY
          }`
        );
        const data = await response.json();
        const results = data.results;

        if (results.length > 0) {
          const randomIndex = Math.floor(Math.random() * results.length);
          Missive.reply({
            mailto: {
              body: `<img src="${results[randomIndex].media_formats.gif.url}" />`,
            },
          });
        }
      },
    },
    {
      // Reply with a random GIF from the search 💭
      contexts: ["draft"],
      label: "Reply with a random GIF from the search 💭",
      callback: async () => {
        const response = await Missive.openForm({
          name: "Add a random GIF",
          fields: [
            {
              type: "input",
              data: {
                name: "search",
                value: "",
                placeholder: "Search for a GIF",
                focus: true,
              },
            },
          ],
          buttons: [
            {
              type: "submit",
              label: "Add it !",
            },
          ],
        });

        if (response && response.search) {
          // Search for the GIF
          try {
            const res = await fetch(
              `https://tenor.googleapis.com/v2/search?q=${
                response.search
              }&key=${import.meta.env.VITE_TENOR_APIKEY}`
            );
            const data = await res.json();
            const results = data.results;

            if (results.length > 0) {
              const randomIndex = Math.floor(Math.random() * results.length);
              Missive.reply({
                mailto: {
                  body: `<img src="${results[randomIndex].media_formats.gif.url}" />`,
                },
              });
            }
          } catch (error) {
            console.error(error);
          }
        }
      },
    },
  ]);

    // Feature 5 (by Louis): Analyse the content of the conversation and propose GIFs
    useEffect(() => {
      const handler = (event: unknown) => {
        const ids = event as string[];
        Missive.fetchConversations(ids).then((conversations: any) => {
          if (conversations.length !== 1) {
            setConversation({subject: ""});
            return;
          }
          setConversation(conversations[0].latest_message);
        });
      };
  
      Missive.on("change:conversations", handler);
      return () => Missive.on("change:conversations", handler);
    }, []);

  return (
    <div>
      <SearchGifs
        onGifSelected={(selectedGif) => handleGifSelection(selectedGif)}
        conversation={conversation}
      />
      <Footer />
    </div>
  );
};

export default App;
