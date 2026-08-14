"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validation/auth.schema";
import { useLogin } from "@/hooks/useLogin";
import Section from "@/components/layout/Section";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { ROUTES } from "@/constants/routes";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = (values) => {
    loginMutation.mutate(
      { username: values.email, password: values.password },
      { onSuccess: () => router.push(ROUTES.articles) },
    );
  };

  return (
    <Section className="w-full max-w-[480px]">
      <div className="border-b border-neutral-st3 px-8 py-6">
        <h1 className="text-title-3 tracking-title-3 font-semibold text-neutral-fg1">
          Sign in
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 px-8 py-6">
        {justRegistered && (
          <Toast
            variant="success"
            title="Account created"
            description="This demo doesn't persist new accounts — sign in with the demo credentials from the README."
          />
        )}

        <Field label="Email" htmlFor="login-email" error={errors.email?.message}>
          {/* type="text", not "email" — this field's value is sent to
              DummyJSON as `username`, which isn't email-formatted, so the
              browser's native email validation would block valid logins. */}
          <Input
            id="login-email"
            type="text"
            autoComplete="username"
            error={Boolean(errors.email)}
            {...register("email")}
          />
        </Field>

        <Field label="Password" htmlFor="login-password" error={errors.password?.message}>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            error={Boolean(errors.password)}
            {...register("password")}
          />
        </Field>

        {loginMutation.isError && (
          <Toast
            variant="error"
            title="Sign in failed"
            description={loginMutation.error.message}
          />
        )}

        <Button type="submit" isLoading={loginMutation.isPending} className="w-full">
          Sign in
        </Button>

        <p className="text-center text-body-2 tracking-body-2 text-neutral-fg1">
          Don&apos;t have an account?{" "}
          <Link href={ROUTES.register} className="font-semibold text-primary hover:text-primary-hover">
            Sign up now
          </Link>
        </p>
      </form>
    </Section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
