import { privateApi } from "../axios-wrapper";

export const deleteProperty = async (id: string) => {
  try {
    const response = await privateApi.delete(`/properties/${id}`);
    return response.data;
  } catch (err) {
    return err
  }
};