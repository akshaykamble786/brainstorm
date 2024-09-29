"use client";

import Loader from "@/components/global/loader"; 
import Logo from "@/components/global/logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { actionSignUpUser } from "@/lib/server-actions/auth-actions";
import { FormSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";

const SignUpFormSchema = z
  .object({
    email: z.string().describe("Email").email({ message: "Invalid Email" }),
    password: z
      .string()
      .describe("Password")
      .min(6, "Password must be minimum 6 characters"),
    confirmPassword: z
      .string()
      .describe("Confirm Password")
      .min(6, "Password must be minimum 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const SignUpPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState("");
  const [confirmation, setConfirmation] = useState(false);

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async ({ email, password }: z.infer<typeof FormSchema>) => {
    try {
      console.log("Submitting form..."); 
      const { error } = await actionSignUpUser({ email, password });

      if (error) {
        console.error("Sign-up error:", error.message); 
        setSubmitError(error.message);
        form.reset(); // Optional: Reset form fields
        return;
      }

      console.log("Sign-up successful"); 
      setConfirmation(true);
    } catch (err) {
      console.error("Unexpected error:", err); // Catch any unexpected errors
      setSubmitError("An unexpected error occurred");
    } finally {
      form.clearErrors(); // Ensure the form's submitting state resets
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onChange={() => {
          if (submitError) setSubmitError("");
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col"
      >
        <Link href="/" className="w-full flex justify-left items-center">
          <Logo />
        </Link>

        <FormDescription className="text-foreground/60">
          An all-In-One Collaboration and Productivity Platform
        </FormDescription>

        {!confirmation && (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full p-6" disabled={isLoading}>
              {isLoading ? <Loader /> : "Create Account"}
            </Button>
          </>
        )}

        {submitError && <FormMessage>{submitError}</FormMessage>}

        <span className="self-container">
          Already have an account?{" "}
          <Link href="/login" className="text-primary">
            Login
          </Link>
        </span>

        {confirmation && (
          <Alert className="bg-primary">
            <MailCheck className="size-4" />
            <AlertTitle>Check your email</AlertTitle>
            <AlertDescription>
              An email confirmation has been sent.
            </AlertDescription>
          </Alert>
        )}
      </form>
    </FormProvider>
  );
};

export default SignUpPage;

