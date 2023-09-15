export interface CreateBook {
  title: string;

  description: string;

  total_Score: number;

  pages: number;

  published_at: Date;

  author: Author;

  genres: Genres[];

  cover_pic?: Image;
}

interface Author {
  name: string;
}

interface Genres {
  genre: string;
}

interface Image {
  url: string;
}
