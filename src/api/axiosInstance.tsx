import axios from "axios";
const token = localStorage.getItem("access_token");
const headers = {
  Authorization: "Bearer " + token,
};
export const axiosInstance = axios.create({
  baseURL: "https://apiagrotracker.thalestonon.com.br/api/",
  headers,
});
