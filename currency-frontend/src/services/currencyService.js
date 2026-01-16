import api from "../api/axios";

export const getCurrencies = async () => {
  const res = await api.get("/currencies/");
  return res.data;
};
