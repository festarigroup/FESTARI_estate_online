import { privateApi } from "../axios-wrapper";

export const approveHotel = async (id: string) => {
  try {
    const response = await privateApi.put(`/hotels/${id}/approve`);
    return response.data;
  } catch (err) {
    return err
  }
};