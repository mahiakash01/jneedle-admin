"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "@/types/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { createSession } from "@/appwrite/session";

interface LoginFormProps {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginFormProps>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = async (data: LoginFormProps) => {
    console.log(data);
    const res = await createSession(data);
    if (res.redirect) {
      router.push("/");
    }
    if (res.error) {
      toast.error(res.error);
    }
  };

  return (
    <div className="flex w-full relative items-center justify-center px-10">
      <div className="mx-auto z-10 text-gray-700 w-full max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(login)} className="mt-8">
            <div className="space-y-5">
              <div>
                <Label htmlFor="email">Email</Label>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          required
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          required
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <button
                type="submit"
                className="relative flex justify-center items-center h-12 w-full mx-auto text-center font-geist tracking-tighter overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-300 hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2"
              >
                Sign in
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
