export interface Gif {
  id: string;
  media_formats?: {
    gif?: {
      url: string;
    };
  };
  content_description: string;
}
