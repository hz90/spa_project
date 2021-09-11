import instance from '@/config/axios';
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';

const baseUrl = process.env.VUE_APP_BASE_API;

/* eslint-disable */
export default class ApiService {
  public static Get<T>(url: string): Promise<T> {
    return this.HttpRequest<T>({
      baseURL: baseUrl,
      url: url,
      method: 'GET',
    });
  }
  // url: string, data?: any, config?: AxiosRequestConfig
  public static Post<T>(url: string, payload: any): Promise<AxiosResponse<any>> {
    return  instance.post(baseUrl+url,payload);
   
  }

  public static Patch<T>(url: string, payload: any): Promise<T> {
    return this.HttpRequest<T>({
      baseURL: baseUrl,
      url: url,
      method: 'PATCH',
      data: payload,
    });
  }

  public static Put<T>(url: string, payload: any): Promise<T> {
    return this.HttpRequest<T>({
      baseURL: baseUrl,
      url: url,
      method: 'PUT',
      data: payload,
    });
  }

  public static Delete(url: string, baseUrl = process.env.VUE_APP_BASE_API) {
    return instance({
      baseURL: baseUrl,
      url: url,
      method: 'DELETE',
    });
  }

  public static HttpRequestWithOriginResponse(
    options: AxiosRequestConfig
  ): AxiosPromise<any> {
    return instance(options);
  }

  public static HttpRequest<T>(options: AxiosRequestConfig): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      instance(options)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
