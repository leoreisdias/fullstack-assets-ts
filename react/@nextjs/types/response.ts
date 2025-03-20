// Types for the result object with discriminated union
export type Success<T> = {
  error: null;
  payload: T;
  statusCode?: number;
  message: string;
  ok: true;
};

export type Failure<E = Error> = {
  ok: false;
  payload: null;
  error: E;
  statusCode?: number;
  message: string;
};

export type Result<T = unknown, E = Error> = Success<T> | Failure<E>;

export type PaginatedResult<T = any> = {
  payload: {
    content: T[];
    totalPages: number;
    count: number;
  };
  statusCode: number;
  message: string;
};
