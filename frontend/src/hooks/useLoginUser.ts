"use client";
import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type LoginCredentials = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
};

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      const { access_token } = response.data;

      Cookies.set("token", access_token, {
        expires: 1,
        sameSite: "Lax",
      });

      return response.data;
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
  });
}
