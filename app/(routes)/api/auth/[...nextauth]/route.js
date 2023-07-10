import NextAuth from "next-auth";
import { NextAuthOptions } from "./options";

const handler = NextAuth(NextAuthOptions);

export { handler as GET, handler as POST };

// every next.js route is a serverless route -> lambda -> dynamodb
