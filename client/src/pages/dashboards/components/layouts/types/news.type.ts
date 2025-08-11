export interface News {
  id: string;
  title: string;
  category: string;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
}
