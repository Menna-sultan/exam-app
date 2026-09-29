export interface IErrorResponse {
  status: false;
  message: string;
  code: number;
}

export interface ISuccessResponse<T> {
  status: true;
  message?: string;
  payload: T;
}
export type IApiResponse<T> = | IErrorResponse| ISuccessResponse<T>;

export interface IDocumentFields
{
  createdAt: string;
  updatedAt: string;
}

export interface IpaginatedResponse<T> 
{
  data: T[];
  metadata :
  {
    page:number
    limit: number
    total :number
    totalPages:number
  }

}
export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IpaginatedResponse<T> {
  data: T[];
  metadata: IPaginationMeta;
}