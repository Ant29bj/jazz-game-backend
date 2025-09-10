import { envs } from "@/config/envs.js";
import axios from "axios";


export const dreezerApi = axios.create({
  baseURL: envs.dreezerApi ?? ""
});
