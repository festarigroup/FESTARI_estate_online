import { privateApi } from "../axios-wrapper";

export interface UploadPropertyImageType{
    propertyId: string,
    file: File
}

export const uploadPropertyImage = async (data: UploadPropertyImageType) => {
  const formData = new FormData();
  formData.append("file", data.file);

  const response = await privateApi.post(
    `/properties/${data.propertyId}/upload-media/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};