import { privateApi } from "../axios-wrapper";

export interface UploadHotelImageType{
    hotelId: string,
    file: File
}

export const uploadHotelImage = async (data: UploadHotelImageType) => {
  const formData = new FormData();
  formData.append("file", data.file);

  const response = await privateApi.post(
    `/properties/${data.hotelId}/upload-media/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};