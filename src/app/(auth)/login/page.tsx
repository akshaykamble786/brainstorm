"use client";

import { FormSchema } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Form, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Logo from "@/components/logo";
import Google from "../../../../public/google.png";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/loader";
import Image from "next/image";
import { actionLoginUser } from "@/lib/server-actions/auth-actions";

const LoginPage = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: { email: "", password: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (
    formData
  ) => {
    const { error } = await actionLoginUser(formData);
    if(error){
      form.reset();
      setSubmitError(error.message);
    }
    router.replace('/dashboard');
  };

  return (
    <FormProvider {...form}>
      <form
        onChange={() => {
          if (submitError) setSubmitError("");
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full sm:justify-center sm:W-[400px] space-y-6 flex flex-col"
      >
        <Link href="/" className="w-full flex justify-left items-center">
          <Logo />
        </Link>
        <FormDescription className="text-foreground/60">
          An all-In-One Collaboration and Productivity Platform
        </FormDescription>

        <FormField
          disabled={isLoading}
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
          disabled={isLoading}
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

        {submitError && <FormMessage>{submitError}</FormMessage>}
        <Button
          type="submit"
          className="w-full p-6"
          size="lg"
          disabled={isLoading}
        >
          {!isLoading ? "Login" : <Loader />}
        </Button>
        <span className="self-center">
          Dont have an account?
          <Link href="/signup" className="text-primary">
            Sign Up
          </Link>
        </span>
        <Separator />
        <Button
          type="button"
          className="w-full relative flex items-center justify-center"
          size="lg"
          variant="outline"
        >
          <Image src={Google} alt="google logo" width={25} height={25} className="size-5 mr-2"/>
          Login with Google
        </Button>
      </form>
    </FormProvider>
  );
};

export default LoginPage;
