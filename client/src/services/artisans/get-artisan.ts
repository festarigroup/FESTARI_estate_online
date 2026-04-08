import { publicApi } from "../axios-wrapper";

export const getArtisan = async (id: string) => {
  try {
    const response = await publicApi.get(`/artisan/${id}`);
    return response.data;
  } catch (err) {
    return err
  }
};