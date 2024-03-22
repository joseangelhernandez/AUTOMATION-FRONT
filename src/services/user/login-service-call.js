import axios from 'src/utils/axios';

export async function loginServiceCall(user, password) {
  const response = await axios.post('/auth/login', { user, password });
  return response.data;
}
