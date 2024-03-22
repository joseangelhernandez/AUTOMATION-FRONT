import axios from 'src/utils/axios';

export const InstagramAutomationService = async (data) => {
  const response = await axios.post('/api/IGAutomation/IG', data);
  return response;
};

export const InstagramAccountsQty = async () => {
  const response = await axios.get('/api/IGAutomation/AccountsQuantity');
  return response;
};
