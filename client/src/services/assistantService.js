import { assistantAPI, handleAPIError } from './api';

export const assistantService = {
  chat: async ({ message, history = [], module }) => {
    try {
      const response = await assistantAPI.post('/chat', {
        message,
        history,
        module,
      });

      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },
};

export default assistantService;
