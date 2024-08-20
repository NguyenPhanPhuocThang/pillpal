import { axiosClient } from "../utils/axios";

export const getListMedicine = async (params) => {
  const res = await axiosClient.get("/api/medicines", { params: params });
  return res.data;
};

export const getMedicine = async (id) => {
  const res = await axiosClient.get(`/api/medicines/${id}`);
  return res.data;
};

export const postCreateMedicine = async (data) => {
  const res = await axiosClient.post("/api/medicines", data);
  return res.data;
};

export const importMedicine = async (data) => {
  const res = await axiosClient.post("/api/medicines/import", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteMedicine = async (id) => {
  const res = await axiosClient.delete(`/api/medicines/${id}`);
  return res.data;
};

export const putUpdateMedicine = async (id, data) => {
  const res = await axiosClient.put(`/api/medicines/${id}`, data);
  return res.data;
};

export const postAddMedicineToBrandWithPrice = async (medicineId, data) => {
  const res = await axiosClient.post(
    `/api/medicines/${medicineId}/brands`,
    data
  );
  return res.data;
};

export const putAddMedicineToBrandWithPrice = async (medicineId, data) => {
  const res = await axiosClient.put(
    `/api/medicines/${medicineId}/brands`,
    data
  );
  return res.data;
};
