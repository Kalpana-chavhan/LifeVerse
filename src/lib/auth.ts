import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { bearer } from "better-auth/plugins";
import { NextRequest } from 'next/server';
import { headers } from "next/headers";
import clientPromise from "@/lib/mongodb";

let authInstance: ReturnType<typeof betterAuth> | null = null;

async function getAuthInstance() {
  if (authInstance) return authInstance;
  
  const client = await clientPromise;
  const db = client.db("lifeverse");
  
  authInstance = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {    
      enabled: true
    },
    plugins: [bearer()]
  });
  
  return authInstance;
}

export const auth = {
  api: {
    getSession: async (options: { headers: Headers }) => {
      const instance = await getAuthInstance();
      return instance.api.getSession(options);
    }
  },
  handler: async (request: Request) => {
    const instance = await getAuthInstance();
    return instance.handler(request);
  }
};

export async function getCurrentUser(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user || null;
}
