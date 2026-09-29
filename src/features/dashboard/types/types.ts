export type ApiSuccess<T> = { status: true; code: number; payload: T };
export type ApiError = {
  status: false;
  code: number;
  message: string;
  errors?: { path: string; message: string; messages?: string[] }[];
};

export type PageMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = { data: T[]; metadata: PageMeta };

export type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};