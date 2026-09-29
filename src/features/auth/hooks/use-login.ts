import { useMutation } from "@tanstack/react-query";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginFields } from "../types/auth";

export default function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (fields: LoginFields) => {
      const result = await signIn("credentials", {
        username: fields.username,
        password: fields.password,
        redirect: false,
        callbackUrl: "/diplomas",
      });

      if (!result?.ok) {
        throw new Error(result?.error || "Invalid username or password");
      }

      const session = await getSession();

      return {
        result,
        role: session?.user?.role,
      };
    },

    onSuccess: (result) => {
      const isAdmin = result.role === "ADMIN" || result.role === "SUPER_ADMIN";
      const targetUrl = isAdmin ? "/dashboard" : "/diplomas";

      if (typeof window !== "undefined") {
        window.location.assign(targetUrl);
        return;
      }

      router.replace(targetUrl);
    },
  });
}