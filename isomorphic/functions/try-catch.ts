import { HttpError } from "../../react/@errors/error-helper";

export async function tryCatch<T = any>(
  promise: Promise<T>
): Promise<T> {
  try {
    const data = await promise;
    return data as T;
  } catch (error) {
    throw HttpError.fromUnknown(error);
  }
}
