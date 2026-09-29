import React from "react";
import AuthSideSection from "@/features/auth/componentes/auth-side-section";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
   
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <div className="hidden lg:block">
        <AuthSideSection />
      </div>
      
      <main className="flex flex-col p-8 lg:p-16 justify-center">
      
        <div className="max-w-md mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}