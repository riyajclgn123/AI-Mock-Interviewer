type REACT_APP_ENVIRONMENT = "local" | "development" | "production";

export type Env = {
  name: REACT_APP_ENVIRONMENT;
  buildNumber: string;
  apiBaseUrl: string;
  host: string;
};

const host = `${window.location.protocol}//${window.location.host}`;

export const EnvVars: Env = {
  name: import.meta.env.VITE_REACT_APP_ENVIRONMENT as REACT_APP_ENVIRONMENT,
  buildNumber: import.meta.env.VITE_REACT_APP_BUILD_NUMBER || "local",
  apiBaseUrl: import.meta.env.VITE_REACT_APP_API_BASE_URL || "http://localhost:5000", // ✅ fallback here
  host,
};
