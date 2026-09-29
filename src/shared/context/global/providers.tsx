import React from "react";
import ReactQueryProvider from "./providers/react-query.provider";
import { TanStackDevtools } from "@tanstack/react-devtools";
import NextAuthProvider from "./providers/next-auth.provider";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <TanStackDevtools config={{defaultOpen:false}}/>
     <NextAuthProvider>
       

{children}
</NextAuthProvider>
    </ReactQueryProvider>
 )
}