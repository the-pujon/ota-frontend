// import { IMeta } from '@/types'
// import type { BaseQueryFn } from '@reduxjs/toolkit/query'
// import axios from 'axios'
// import type { AxiosRequestConfig, AxiosError } from 'axios'

// export const axiosBaseQuery =
//   (
//     { baseUrl }: { baseUrl: string } = { baseUrl: '' }
//   ): BaseQueryFn<
//     {
//       url: string
//       method?: AxiosRequestConfig['method']
//       data?: AxiosRequestConfig['data']
//       params?: AxiosRequestConfig['params']
//       headers?: AxiosRequestConfig['headers']
//       meta?:IMeta
//       contentType?:string
//     },
//     unknown,
//     unknown
//   > =>
//   async ({ url, method, data, params, contentType }) => {
//     try {
//       const result = await axios({
//         url: baseUrl + url,
//         method,
//         data,
//         params,
//         headers: {
//           "Content-Type": contentType || "application/json",
//         },
//         withCredentials: true,
        
//       })
//       return { data: result.data }
//     } catch (axiosError) {
//       const err = axiosError as AxiosError
//       return {
//         error: {
//           status: err.response?.status,
//           data: err.response?.data || err.message,
//         },
//       }
//     }
//   }

import { IMeta } from '@/types'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import axios from 'axios'
import type { AxiosRequestConfig, AxiosError } from 'axios'

// export const axiosBaseQuery =
//   (
//     { baseUrl }: { baseUrl: string } = { baseUrl: '' }
//   ): BaseQueryFn<
//     {
//       url: string
//       method?: AxiosRequestConfig['method']
//       data?: AxiosRequestConfig['data']
//       params?: AxiosRequestConfig['params']
//       headers?: AxiosRequestConfig['headers']
//       meta?: IMeta
//       contentType?: string
//     },
//     unknown,
//     unknown
//   > =>
//   async ({ url, method, data, params, contentType }) => {
//     try {
//       const headers: AxiosRequestConfig['headers'] = {};

//       if (contentType === 'multipart/form-data') {
//         headers['Content-Type'] = contentType || 'multipart/form-data';
//       } else {
//         headers['Content-Type'] = contentType || 'application/json';
//       }

//       const result = await axios({
//         url: baseUrl + url,
//         method,
//         data,
//         params,
//         headers,
//         withCredentials: true,
//       });

//       return { data: result.data };
//     } catch (axiosError) {
//       const err = axiosError as AxiosError;
//       return {
//         error: {
//           status: err.response?.status,
//           data: err.response?.data || err.message,
//         },
//       };
//     }
//   };


// export const axiosBaseQuery =
//   (
//     { baseUrl }: { baseUrl: string } = { baseUrl: '' }
//   ): BaseQueryFn<
//     {
//       url: string
//       method?: AxiosRequestConfig['method']
//       data?: AxiosRequestConfig['data']
//       params?: AxiosRequestConfig['params']
//       headers?: AxiosRequestConfig['headers']
//       meta?: IMeta
//       contentType?: string
//     },
//     unknown,
//     unknown
//   > =>
//   async ({ url, method, data, params, contentType }) => {
//     try {
//       const headers: AxiosRequestConfig['headers'] = {};

//       if (data instanceof FormData) {
//         headers['Content-Type'] = 'multipart/form-data'; 
//       } else {
//         headers['Content-Type'] = contentType || 'application/json';
//       }

//       const result = await axios({
//         url: baseUrl + url,
//         method,
//         data, // Ensure `data` is correctly passed
//         params,
//         headers,
//         withCredentials: true,
//       });

//       return { data: result.data };
//     } catch (axiosError) {
//       const err = axiosError as AxiosError;
//       return {
//         error: {
//           status: err.response?.status,
//           data: err.response?.data || err.message,
//         },
//       };
//     }
//   };



export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string
      method?: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
      headers?: AxiosRequestConfig['headers']
      meta?: IMeta
      contentType?: string
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, contentType }) => {
    try {
      const headers: AxiosRequestConfig['headers'] = {};

      if (data instanceof FormData) {
        headers['Content-Type'] = 'multipart/form-data'; 
      } else {
        headers['Content-Type'] = contentType || 'application/json';
      }

      // console.log("Sending Request:", { url, method, headers, data });

      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
        withCredentials: true,
      });

      console.log("Response:", result.data);

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      console.error("Axios Error:", err);
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
