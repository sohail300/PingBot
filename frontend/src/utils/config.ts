import axios from "axios";

// const BASE_URL = "http://localhost:8000/api";
const BASE_URL = "https://pingbotapi.heysohail.xyz/api";

export const api = axios.create({
  baseURL: BASE_URL,
});
