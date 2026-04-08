import { Hotel } from "@/types/Hotel";
import { publicApi } from "../axios-wrapper";

export const getHotel = async (id: string) => {
  try {
    const response = await publicApi.get<Hotel>(`/hotels/${id}`);
    return response.data;
  } catch (err) {
    return err
  }
};