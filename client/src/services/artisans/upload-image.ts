import { privateApi } from "../axios-wrapper";

export interface UploadArtisanImageType{
    artisanId: string,
    file: File
}

export const uploadArtisanImage = async (data: UploadArtisanImageType) => {
  const formData = new FormData();
  formData.append("file", data.file);

  const response = await privateApi.post(
    `/artisans/${data.artisanId}/upload-media/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};