import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

export const authSlice = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<
      { accessToken: string; refreshToken: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: { accessToken: string; refreshToken: string }) => {
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        return response;
      },
      transformErrorResponse: (error: { status: number; data?: { message: string } }) => ({
        success: false,
        error: error.data?.message || error.status === 0 ? 'Network error' : 'Login failed',
      })
    }),

    register: builder.mutation<
      { accessToken: string; refreshToken: string },
      { email: string; password: string; name: string }
    >({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: { accessToken: string; refreshToken: string }) => {
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        return response;
      },
      transformErrorResponse: (error: { status: number; data?: { message: string } }) => ({
        success: false,
        error: error.data?.message || error.status === 0 ? 'Network error' : 'Registration failed',
      })
    }),

    refresh: builder.mutation<
      { accessToken: string },
      void
    >({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
        body: {
          refreshToken: localStorage.getItem('refreshToken'),
        },
      }),
      transformResponse: (response: { accessToken: string }) => {
        if (response.accessToken) {
          try {
            localStorage.setItem('accessToken', response.accessToken);
          } catch (error) {
            console.error('Failed to store access token:', error);
          }
        }
        return response;
      },
      transformErrorResponse: (error: { status: number; data?: { message: string } }) => ({
        success: false,
        error: error.data?.message || error.status === 0 ? 'Network error' : 'Token refresh failed',
      }),
    }),

    logout: builder.mutation<
      { success: boolean },
      void
    >({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        body: {
          refreshToken: localStorage.getItem('refreshToken'),
        },
      }),
      transformResponse: (response: { success: boolean }) => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return response;
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation,
} = authSlice;
