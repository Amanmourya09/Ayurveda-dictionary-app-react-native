import axios from 'axios';

const API = axios.create({
  baseURL: 'https://dictionary.ccras.org.in/api/',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true' 
  }
});

export default API;