import axios from 'axios';
import { CCRAS_API } from '../../config'

const API = axios.create({
  baseURL:CCRAS_API,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true' 
  }
});

export default API;