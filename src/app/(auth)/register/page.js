"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/validation/auth.schema";
import { useRegister } from "@/hooks/useRegister";
import Section from "@/components/layout/Section";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { ROUTES } from "@/constants/routes";

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = (values) => {
    registerMutation.mutate(values, {
      onSuccess: () => router.push(`${ROUTES.login}?registered=1`),
    });
  };

  return (
    <>
      {/* Same fixed-top placement as Login's error toast (Sign-in ->
          Failed reference) — no Figma screenshot exists for a failed
          Sign-up specifically, but it's the same Toast/pattern, so it's
          kept consistent rather than left inline while Login isn't. */}
      {registerMutation.isError && (
        <div className="fixed inset-x-0 top-6 z-50 flex justify-center px-4">
          <Toast
            variant="error"
            title="Sign up failed"
            description="Something went wrong. Please try again."
          />
        </div>
      )}

      <Section className="w-full max-w-[480px]">
        <div className="border-b border-neutral-st3 px-8 py-6">
          <h1 className="text-title-3 tracking-title-3 font-semibold text-neutral-fg1">
            Sign up
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 px-8 py-6">
          <Field label="Username" htmlFor="register-username" error={errors.username?.message}>
            <Input
              id="register-username"
              autoComplete="username"
              error={Boolean(errors.username)}
              {...register("username")}
            />
          </Field>

          <Field label="Email" htmlFor="register-email" error={errors.email?.message}>
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              error={Boolean(errors.email)}
              {...register("email")}
            />
          </Field>

          <Field label="Password" htmlFor="register-password" error={errors.password?.message}>
            <Input
              id="register-password"
              type="password"
              autoComplete="new-password"
              error={Boolean(errors.password)}
              {...register("password")}
            />
          </Field>

          <Button type="submit" isLoading={registerMutation.isPending} className="w-full">
            Sign up
          </Button>

          <p className="text-center text-body-2 tracking-body-2 text-neutral-fg1">
            Have an account?{" "}
            <Link href={ROUTES.login} className="font-semibold text-primary hover:text-primary-hover">
              Sign in
            </Link>
          </p>
        </form>
      </Section>
    </>
  );
}
