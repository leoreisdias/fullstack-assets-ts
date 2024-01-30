// USAGE BASED ON NEXTJS 14 - RSC

// GETTING NEXT-AUTH SESSION ACCESS_TOKEN AND TYPING

export const fetcher = async <T = unknown>(
    input: RequestInfo,
    init: RequestInit | undefined = undefined,
    api: Microservice = 'api-users',
  ) => {
    let session: Session | null = null;
    session = await getSession();
  
    if (!session) session = await getServerSession(nextAuthOptions);
  
    const baseUrl = setBaseURL(api);
  
    const res = await fetch(`${baseUrl}${input}`, {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
    });
  
    if (!res.ok) {
      console.error('fetcher:url:', input, 'init:', init, 'res:', res);
      throw new Error('An error occurred while fetching the data.');
    }
  
    const data = await res.json();
  
    return data as TResponse<T>;
  };
  