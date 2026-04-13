import { privateApi } from "../axios-wrapper";

export const rejectArtisan = async (id: string) => {
  try {
    const response = await privateApi.put(`/artisans/${id}/reject`);
    return response.data;
  } catch (err) {
    return err
  }
};