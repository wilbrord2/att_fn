"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Button from "../components/Button/greenButton";
import InputField from "../components/Form/InputField";
import AuthLayoutPage from "../components/tamplates/authLayout";
import Title from "../components/titles/title";
import ErrorCard from "../components/Form/error";
import { SignupApi } from "../api/auth/signup";

const signupSchema = z.object({
  fullname: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z
    .string()
    .regex(/^07\d{8}$/, "Phone must be in the format 07********"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const result = await SignupApi(data);

      if (result.success) {
        router.push("/");
      } else {
        setErrorMessage(result.error.message || "Signup failed");
      }
    } catch (error) {
      setErrorMessage("Error signing up");
    }
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <AuthLayoutPage>
      <div className="w-full h-full p-4 md:p-8 flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-lg space-y-6"
        >
          <Title
            title="Sign Up"
            description="Fill out the form below to create your account"
          />

          {/* Full Name */}
          <InputField
            placeholder="Full Name"
            type="text"
            registration={register("fullname")}
            error={errors.fullname}
            required
          />

          {/* Email */}
          <InputField
            placeholder="Email"
            type="email"
            registration={register("email")}
            error={errors.email}
            required
          />

          {/* Phone */}
          <InputField
            placeholder="Phone (07********)"
            type="text"
            registration={register("phone")}
            error={errors.phone}
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

          {/* Error Message */}
          {errorMessage && <ErrorCard errorMessage={errorMessage} />}

          {/* Submit Button */}
          <Button
            title={isSubmitting ? "Signing up..." : "Sign Up"}
            disabled={isSubmitting}
            type="submit"
          />

          <div className="text-sm font-medium text-[#2F445D] text-center font-sans w-full">
            Already have an account?{" "}
            <Link href={"/"} className="text-default-green underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </AuthLayoutPage>
  );
}
