export type Diploma = {
  id: string;
  title: string;
  description: string;
  image: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DiplomaInput = {
  title: string;
  description: string;
  image?: string | null;
};

export type DiplomaListOptions = {
  page?: number;
  limit?: number;
  search?: string;
  immutable?: boolean;
  sortBy?: "createdAt";
  sortOrder?: "asc" | "desc";
};

export type PaginatedDiplomas = {
  data: Diploma[];
  metadata: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};