import axios from 'axios';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { env } from '@/app/env';
import { auth } from '@/auth';


// CLIENT SIDE GETS HERE AND THEN IN YOUR API
// WHY? REASON: IN THIS APPROCH YOU KEEP YOUR ENVs AS SERVER-ONLY AVOIDING THE NEED OF A PER ENVIRONMENT DEPLOY SCRIPT
export async function GET(request: Request) {
  const session = await auth(); // NEXT-AUTH SESSION APPROACH EXAMPLE
  const token = session?.user.accessToken;

  const header = headers();
  const apiEndpoint = request.url.split('/api-front/my-api')[1];

  const userAgent = header.get('user-agent');

  const { data } = await axios.get(apiEndpoint, {
    baseURL: env.USERS_BASE_URL,
    headers: {
      userAgent, // IF YOU NEED TO STORE USER AGENT DATA
      Authorization: `Bearer ${token}`,
    },
  });

  return NextResponse.json(data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
