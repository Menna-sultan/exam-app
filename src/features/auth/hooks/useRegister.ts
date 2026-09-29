import { useMutation } from "@tanstack/react-query";
import type { RegisterBody } from "../apis/register.api";
import { register } from "../apis/auth.api";

export default function useRegister() {
  return useMutation({
    mutationFn: async (body: RegisterBody) => {
      const res = await register(body);

      if (!res.status) {
        throw new Error(res.message || "Registration failed");
      }

      return res;
    },
  });
}

