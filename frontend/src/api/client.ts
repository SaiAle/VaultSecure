import axios from 'axios';

const client = axios.create({ baseURL: '/api' });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('vs_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      const refresh = localStorage.getItem('vs_refresh');
      if (refresh) {
        try {
          const { data } = await axios.post('/api/auth/refresh', null, {
            headers: { 'X-Refresh-Token': refresh },
          });
          localStorage.setItem('vs_token', data.token);
          err.config.headers.Authorization = `Bearer ${data.token}`;
          return client.request(err.config);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

export default client;
