import { Alert } from 'react-native';

const API_BASE_URL = 'https://signify-backend-ogbk.onrender.com';

export interface Survey {
  survey_id: string;
  title: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  questions: Question[];
  locations: SurveyLocation[];
}

export interface Question {
  question_id: string;
  question_text: string;
  question_type: string;
  is_required: boolean;
  order_index: number;
  options?: QuestionOption[];
}

export interface QuestionOption {
  option_id: string;
  option_text: string;
}

export interface SurveyLocation {
  location_id: string;
  country: string;
  district: string;
  sector: string;
}

export interface SurveyResponse {
  survey_id: string;
  country: string;
  district: string;
  sector: string;
  answers: Answer[];
}

export interface Answer {
  question_id: string;
  answer_text: string;
}

export interface UserNotification {
  user_notification_id: string;
  user_id: string;
  notification_id: string;
  title: string;
  message: string;
  type: 'survey' | 'alert' | 'info' | 'reminder';
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

class ApiService {
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = await this.getAuthToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Handle empty responses (like 204 No Content)
      const text = await response.text();
      if (!text) {
        return null as T;
      }
      
      return JSON.parse(text);
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Failed to connect to the server. Please try again.');
      throw error;
    }
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      const { authService } = await import('./auth');
      return await authService.getToken();
    } catch (error) {
      return null;
    }
  }

  async getSurveys(country?: string, district?: string, sector?: string): Promise<Survey[]> {
    let endpoint = '/surveys';
    const params = new URLSearchParams();
    
    if (country && district && sector) {
      params.append('country', country);
      params.append('district', district);
      params.append('sector', sector);
      endpoint += `?${params.toString()}`;
    }
    
    return this.request<Survey[]>(endpoint);
  }

  async getSurveyById(id: string): Promise<Survey> {
    return this.request<Survey>(`/surveys/${id}`);
  }

  async submitResponse(response: any): Promise<void> {
    return this.request('/responses', {
      method: 'POST',
      body: JSON.stringify(response),
    });
  }

  async getUserNotifications(userId: string): Promise<UserNotification[]> {
    try {
      return await this.request<UserNotification[]>(`/notifications/user/${userId}`);
    } catch (error) {
      // Fallback to mock data if endpoint fails
      console.warn('Failed to fetch user notifications, using mock data:', error);
      return [
        {
          user_notification_id: '1',
          user_id: userId,
          notification_id: '1',
          title: 'New Health Survey',
          message: 'A new health survey is available. Takes less than 2 minutes.',
          type: 'survey',
          is_read: false,
          created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
        },
        {
          user_notification_id: '2',
          user_id: userId,
          notification_id: '2',
          title: 'Community Health Update',
          message: 'Increased respiratory symptoms reported in your area. Take precautions.',
          type: 'alert',
          is_read: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        },
        {
          user_notification_id: '3',
          user_id: userId,
          notification_id: '3',
          title: 'Thank You',
          message: 'Your last survey response was received. Thank you for helping your community.',
          type: 'info',
          is_read: true,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          read_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        },
      ];
    }
  }

  async markNotificationAsRead(userNotificationId: string): Promise<{ success: boolean; message: string } | null> {
    try {
      const response = await this.request<{ success: boolean; message: string }>(`/notifications/user/${userNotificationId}/read`, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      console.warn('Failed to mark notification as read:', error);
      return null;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const notifications = await this.getUserNotifications(userId);
      return notifications.filter(n => !n.is_read).length;
    } catch (error) {
      console.warn('Failed to get unread count:', error);
      return 0;
    }
  }
}

export const apiService = new ApiService();
