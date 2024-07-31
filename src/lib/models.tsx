export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  detail: string;
  story: string;
  classification: string;
  is_published: boolean;
}

export interface Menu {
  id: number;
  name: string;
  price: number;
  detail: string;
  ingredient: string;
  is_published: boolean;
}

export interface Order {
  id: number;
  name: string;
  total: number;
  price: number;
  note: string;
}