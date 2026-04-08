import { privateApi } from "../axios-wrapper";

export const deleteHotel = async (id: string) => {
  try {
    const response = await privateApi.delete(`/hotels/${id}`);
    return response.data;
  } catch (err) {
    return err
  }
};