import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:3355",
});

export default api;
