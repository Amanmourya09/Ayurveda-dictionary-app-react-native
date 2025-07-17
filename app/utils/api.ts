// utils/api.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/lang',
});




export default API;