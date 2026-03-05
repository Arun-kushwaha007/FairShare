export type ApiError = {
  code: string;
  message: string;
  context: {
    url?: string;
    method?: string;
    status?: number;
    responseData?: unknown;
  };
};
