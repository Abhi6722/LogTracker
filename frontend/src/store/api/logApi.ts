import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

export interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  source?: string;
  requestId?: string;
  headers?: Record<string, unknown>;
  method?: string;
  query?: Record<string, unknown>;
  url?: string;
}

export interface LogFile {
  _id: string;
  name: string;
  size: number;
  enabled: boolean;
  uploadedAt: string;
  logs: LogEntry[];
}

export const logApi = createApi({
  reducerPath: 'logApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');      
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['LogFile'],
  endpoints: (builder) => ({
    uploadLogFile: builder.mutation<LogFile, { name: string; size: number; logs: LogEntry[] }>({
      query: (data) => ({
        url: '/logs/upload',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['LogFile'], // Invalidate cache after upload
    }),
    getLogFiles: builder.query<LogFile[], void>({
      query: () => '/logs',
      providesTags: ['LogFile'], // Provide tags for cache
    }),
    toggleLogFile: builder.mutation<LogFile, string>({
      query: (id) => ({
        url: `/logs/${id}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: ['LogFile'], // Invalidate cache after toggle
    }),
    deleteLogFile: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/logs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LogFile'], // Invalidate cache after delete
    }),
  }),
});

export const {
  useUploadLogFileMutation,
  useGetLogFilesQuery,
  useToggleLogFileMutation,
  useDeleteLogFileMutation,
} = logApi;