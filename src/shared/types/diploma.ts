import { IDocumentFields } from "./api";

export interface IDiploma extends IDocumentFields {
  id: string;
  title: string;
  description: string;
  image: string | null;
  immutable: boolean;
}
