import { Hotel } from "@/types/Hotel";
import { privateApi } from "../axios-wrapper";
import { uploadHotelImage } from "./upload-image";

export interface CreateHotelType {
  name: string;
  description: string;
  location: string;
  nightly_rate: number;
  status: string,
  file?: File
}

export const createHotel = async (data: CreateHotelType) => {
  try {
    const response = await privateApi.post<Hotel>("/hotels/", {
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