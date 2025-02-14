# 🖼️ Tenor GIF Custom Integration 🖼️

## Overview
This project is a custom integration using the **Tenor API** to search for GIFs and insert them as comments in a conversation. The integration allows users to search for GIFs and insert them as comments seamlessly.

## Features
- **Search for GIFs**: Users can search for GIFs using the Tenor API.
- **Insert GIFs as Comments**: Users can insert selected GIFs as comments in a conversation.
- **Automatic Conversation Creation**: If no conversation is selected when inserting a GIF, the integration automatically creates a new conversation before inserting the GIF as a comment.

## Integration with Missive
In Missive, integrations are self-contained and embedded via **iframe**. Missive provides a **Missive JS API** script that enables integrations to communicate with Missive and can optionally add custom actions in the UI.

## Getting Started
1. Clone the repository
2. Create a .env file or .env.local with your Tenor API
```
VITE_TENOR_APIKEY=YOUR_TENOR_API_KEY
```
3. Run the development server: 
```
npm run dev
```
4. You can use Ngrok to create a tunnel to your development server: 
```
npx ngrok http 5173
```
5. Go to vite.config.ts and add the ngrok url to the 
```allowedHosts``` array
5. Go to Missive and add a custom integration using the iframe URL from Ngrok
6. Test the integration !