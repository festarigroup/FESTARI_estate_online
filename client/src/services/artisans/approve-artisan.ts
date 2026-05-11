import { privateApi } from "../axios-wrapper";

export const approveArtisan = async (id: string) => {
  try {
    const response = await privateApi.put(`/artisans/${id}/approve`);
    return response.data;
  } catch (err) {
    return err
  }
};