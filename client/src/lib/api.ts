import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
});

export async function analyzeCode(payload: {
  code: string;
  language?: string;
  filename?: string;
}) {
  try {
    const response = await api.post('/review/analyze', payload);
    return response.data.analysis;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || 'Failed to analyze code');
  }
}

export async function batchAnalyze(files: Array<{
  code: string;
  language?: string;
  filename?: string;
}>) {
  try {
    const response = await api.post('/review/batch', { files });
    return response.data.results;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Batch analysis failed');
  }
}

export async function healthCheck() {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not running');
  }
}
