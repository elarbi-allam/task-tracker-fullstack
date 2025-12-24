import api from './api';
import { User, UpdateUserRequest } from '@/types';

export const userService = {
  async getMe(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  async updateMe(data: UpdateUserRequest): Promise<User> {
    const response = await api.patch<User>('/users/me', data);
    return response.data;
  },
};
