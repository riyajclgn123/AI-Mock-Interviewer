import { showNotification } from "@mantine/notifications";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ApiResponse } from "../constants/types";
import { EnvVars } from "./env-vars";

type ErrorHandlerKeys = keyof typeof errorHandlers;

const axiosInstance = axios.create({
  baseURL: EnvVars.apiBaseUrl,
});

const errorHandlers = {
  400: (response: AxiosResponse<unknown, any>) => {
    return Promise.resolve(response);
  },
  401: () => {
    return Promise.resolve({
      data: null,
      hasErrors: true,
      errors: [
        {
          property: "",
          message: "Sign in.",
        },
      ],
    } as ApiResponse<any>);
  },
  403: () => {
    showNotification({
      message: "You are not authorized to perform this action",
      color: "red",
    });
  },
  404: (response: AxiosResponse<unknown, any>) => {
    console.log(
      "Endpoint Not Found. Check the route you are hitting on your front end matches the route on the backend."
    );
    return Promise.resolve(response);
  },
  500: (response: AxiosResponse<unknown, any>) => {
    console.log(
      "Server Error. Check your backend for null reference exceptions or similar errors."
    );
    showNotification({
      message: "We've encountered a problem.",
      color: "red",
    });
    return Promise.resolve(response);
  },
};

export async function handleResponseError(error: AxiosError) {
  if (error.response) {
    const response: AxiosResponse = error.response;
    const status = response.status as ErrorHandlerKeys;
    const handler = errorHandlers[status];
    if (handler) {
      const result = await handler(error.response);
      if (result) {
        return result;
      }
    }
  }
}

const baseUrl = EnvVars.apiBaseUrl;

axiosInstance.interceptors.response.use((x: any) => x, handleResponseError);

function post<T>(route: string, data: any) {
  var url = baseUrl + route;
  return axiosInstance.post<T>(url, data);
}

function get<T>(route: string) {
  var url = baseUrl + route;
  return axiosInstance.get<T>(url);
}

function put<T>(route: string, data: any) {
  var url = baseUrl + route;
  return axiosInstance.put<T>(url, data);
}

function remove<T>(route: string) {
  var url = baseUrl + route;
  return axiosInstance.delete<T>(url);
}

type Api = {
  post<T>(route: string, data?: any): Promise<AxiosResponse<T>>;
  get<T>(url: string): Promise<AxiosResponse<T>>;
  delete<T>(route: string): Promise<AxiosResponse<T>>;
  put<T>(route: string, data: any): Promise<AxiosResponse<T>>;
};

const api = {} as Api;

api.get = get;
api.put = put;
api.post = post;
api.delete = remove;

export default api;
