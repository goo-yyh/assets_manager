import axios from 'axios';
import { mockAdapter } from './mockAdapter';

export const http = axios.create({
  baseURL: '/mock',
  timeout: 8000,
  adapter: mockAdapter,
});
