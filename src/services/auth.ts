import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './api';

export interface LoginCredentials {
  phone_number: string;
}

export interface RegisterUserData {
  phone_number: string;
  name?: string;
  country: string;
  district: string;
  sector: string;
}

export interface AuthUser {
  user_id: string;
  phone_number: string;
  name?: string;
  country: string;
  district: string;
  sector: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      // For mobile users, we'll find or create by phone number
      const response = await apiService.request<AuthUser>(`/users/phone/${credentials.phone_number}`, {
        method: 'GET',
      });

      // If user doesn't exist, they need to register
      if (!response) {
        throw new Error('User not found. Please register first.');
      }

      await this.storeAuth(response);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterUserData): Promise<AuthUser> {
    try {
      const response = await apiService.request<AuthUser>('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      await this.storeAuth(response);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.TOKEN_KEY, this.USER_KEY]);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const userStr = await AsyncStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }

  private async storeAuth(user: AuthUser): Promise<void> {
    try {
      // For simplicity, we'll use the user_id as token
      const token = user.user_id;
      await AsyncStorage.multiSet([
        [this.TOKEN_KEY, token],
        [this.USER_KEY, JSON.stringify(user)],
      ]);
    } catch (error) {
      console.error('Store auth error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
