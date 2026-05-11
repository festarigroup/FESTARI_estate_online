import { publicApi } from "../axios-wrapper";

export const getHomeSummary = async () => {
  try {
    const response = await publicApi.get(`/home/summary`);
    return response.data;
  } catch (err) {
    return err
  }
};