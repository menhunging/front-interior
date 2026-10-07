import axios, { type AxiosInstance } from "axios";

let apiClient: AxiosInstance | null = null;

export const useApiClient = () => {
  const appConfig = useAppConfig();
  const baseURL = appConfig.apiHost;

  if (!apiClient || apiClient.defaults.baseURL !== baseURL) {
    apiClient = axios.create({
      baseURL,
      timeout: 15000,
      headers: {
        Accept: "application/json",
      },
    });
  }

  return apiClient;
};
