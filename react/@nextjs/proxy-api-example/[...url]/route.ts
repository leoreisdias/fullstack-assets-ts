import axios from "axios";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const getUserAgent = () => {
  const header = headers();
  const userAgent = header.get("user-agent");

  return userAgent;
}

// CLIENT SIDE GETS HERE AND THEN IN YOUR API
// WHY? REASON: IN THIS APPROCH YOU KEEP YOUR ENVs AS SERVER-ONLY AVOIDING THE NEED OF A PER ENVIRONMENT DEPLOY SCRIPT
export async function GET(request: Request) {
  const token = ""; // Get your token from cookies/third party libs/other...

  const apiEndpoint = request.url.split("/api/proxy-api-example")[1];
  
  const userAgent = getUserAgent();

  const { data } = await axios.get(apiEndpoint, {
    baseURL: process.env.USERS_BASE_URL,
    headers: {
      userAgent, // IF YOU NEED TO STORE USER AGENT DATA
      Authorization: `Bearer ${token}`,
    },
  });

  return NextResponse.json(data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
