export type UploadedFile = {
  id?: string;
  name: string;
  url: string;
  size: number;
};

export interface IFileUploadService {
  findById(id: string): Promise<UploadedFile | null>;
  upload(file: File, resize?: boolean): Promise<UploadedFile>;
  delete(url: string): Promise<void>;
}
