"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "./components/Button/greenButton";
import InputField from "./components/Form/InputField";
import AuthLayoutPage from "./components/tamplates/authLayout";
import Title from "./components/titles/title";
import Link from "next/link";
import { SigninApi } from "./api/auth/signin";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ErrorCard from "./components/Form/error";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await SigninApi(data);

      if (result.success) {
        router.push("/dashboard");
      } else {
        setErrorMessage(result.error.message || "Incorrect phone or password");
      }
    } catch (error) {
      setErrorMessage("Error signing in");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 7000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  return (
    <AuthLayoutPage>
      <div className="w-full h-full p-4 md:p-8 flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-lg space-y-6"
        >
          <Title
            title="Login"
            description="Fill out the below to login to your account"
          />

          {/* Email */}
          <InputField
            placeholder="Email"
            type="email"
            registration={register("email")}
            error={errors.email}
            required
          />

          {/* Password */}
          <InputField
            placeholder="Password"
            type="password"
            registration={register("password")}
            error={errors.password}
            required
          />

          {errorMessage && <ErrorCard errorMessage={errorMessage} />}

          {/* Submit Button */}
          <Button
            title={isSubmitting ? "Logging in..." : "Login"}
            disabled={isSubmitting}
            type="submit"
          />
          <div className="text-sm font-medium text-[#2F445D] text-center font-sans w-full">
            Don’t have an account?{" "}
            <Link href={"/signup"} className="text-default-green underline">
              Sign Up
            </Link>{" "}
          </div>
        </form>
      </div>
    </AuthLayoutPage>
  );
}
