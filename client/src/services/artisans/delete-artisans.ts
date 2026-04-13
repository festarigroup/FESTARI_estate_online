import { privateApi } from "../axios-wrapper";

export const deleteArtisans = async (id: string) => {
  try {
    const response = await privateApi.delete(`/artisans/${id}`);
    return response.data;
  } catch (err) {
    return err
  }
};