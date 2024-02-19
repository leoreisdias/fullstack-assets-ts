export type TResponse<T = any> = {
    payload: T;
    statusCode: number;
    message: string;
    isSuccess: boolean;
  };
  
  export type TPaginated<T = any> = {
    content: T[];
    pageCount: number;
  };
  