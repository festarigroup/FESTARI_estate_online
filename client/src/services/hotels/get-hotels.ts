import { Hotel } from "@/types/Hotel";
import { publicApi } from "../axios-wrapper";

export const getHotels = async () => {
  try {
    const response = await publicApi.get<Array<Hotel>>(`/hotels`);
    return response.data;
  } catch (err) {
    return err
  }
};