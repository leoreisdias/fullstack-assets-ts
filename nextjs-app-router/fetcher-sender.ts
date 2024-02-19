import axios, { AxiosRequestConfig } from 'axios';
import { Session } from 'next-auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

export const fetcher = async <T = unknown>(
  input: RequestInfo,
  init: RequestInit | undefined = undefined,
) => {
  // NEXT-AUTH SESSION EXAMPLE - You can adapt for a different token approach
  let session: Session | null = null;

  session = await auth();

  if (!session) session = await auth();
  const token = session?.user.accessToken
  
  const baseUrl = process.env.BASE_URL; // Example, but I recommend an env variable approach

  const res = await fetch(`${baseUrl}${input}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error('fetcher:url:', input, 'init:', init, 'res:', res);
    
    if (res.status === 401) {
      return redirect(`/sign-out`); // NextAuth Use Case: A custom page to call the server-action signOut from next-auth middleware - Adapt for your use case
    }

    throw new Error('An error occurred while fetching the data.');
  }

  try {
    const data = await res.json();

    return data as TResponse<T>;
  } catch (err) {
    console.error(
      'fetcher:url:',
      `${baseUrl}${input}`,
      'init:',
      init,
      'res:',
      res,
      err,
    );
    return {
      isSuccess: false,
      message: 'An error occurred while fetching the data.',
      payload: null,
    } as TResponse<T>;
  }
};

export const sender = async <T = unknown>(
  config: AxiosRequestConfig & {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  },
) => {
  // NEXT AUTH USAGE: Adapt for your token logic
  let session: Session | null = null;
  
  session = await auth();
  
  if (!session) session = await auth();
  
  const cookieStore = cookies();

  const baseUrl = process.env.BASE_URL;

  try {
    const response = axios<T>({
      ...config,
      baseURL: baseUrl,
      headers: {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
      params: {
        ...config.params,
        lang: cookieStore.get('NEXT_LOCALE')?.value, // If using Internationalization
      },
    });

    return response;
  } catch (err) {
    if ((err as any)?.response?.status === 401) {
      /* REDIRECT WITH INTERNATIONALIZATION
      const cookiesStore = cookies();
      const locale = cookiesStore.get('NEXT_LOCALE');

      return redirect(`/${locale?.value || 'pt'}/sign-out`);

      OR
      */
     return redirect('/');
    }
    
    throw err;
  }
};
