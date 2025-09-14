import axios from "axios";

// const BASE_URL = "http://localhost:8000/api";
const BASE_URL = "https://pingbot-qq0t.onrender.com/api";

export const api = axios.create({
  baseURL: BASE_URL,
});
