import { privateApi } from "../axios-wrapper";

export const rejectHotel = async (id: string) => {
  try {
    const response = await privateApi.put(`/hotels/${id}/reject`);
    return response.data;
  } catch (err) {
    return err
  }
};