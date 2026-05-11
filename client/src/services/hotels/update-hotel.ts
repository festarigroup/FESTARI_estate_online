import { Hotel } from "@/types/Hotel";
import { privateApi } from "../axios-wrapper";
import { uploadHotelImage } from "./upload-image";

export interface UpdateHotelType {
  name: string;
  description: string;
  location: string;
  nightly_rate: number;
  status: string,
  file?: File
}

export const updateHotel = async (id: string, data: UpdateHotelType) => {
  try {
    const response = await privateApi.put<Hotel>(`/hotels/${id}`, {
        ...data
    });

    if(!data.file){
        return response.data;
    }
    await uploadHotelImage({hotelId: response.data.id, file: data.file})
    return response.data;
  } catch (err) {
    return err
  }
};