"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { articleSchema } from "@/validation/article.schema";
import Section from "@/components/layout/Section";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import TagsPanel from "./TagsPanel";

const DEFAULT_VALUES = { title: "", description: "", body: "", tags: [] };

// Shared by Create (Phase 6) and Edit (Phase 7) — same fields, same
// validation, same layout; only the submit behavior and initial values
// differ, both of which the parent page controls via props.
export default function ArticleForm({
  heading = "New article",
  defaultValues = DEFAULT_VALUES,
  onSubmit,
  isSubmitting = false,
  submitError = null,
  submitLabel = "Submit",
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(articleSchema), defaultValues });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-start"
    >
      <Section className="flex w-full flex-col gap-4 p-6 lg:flex-1">
        <h1 className="text-title-3 tracking-title-3 font-semibold text-neutral-fg1">
          {heading}
        </h1>

        <Field label="Title" htmlFor="article-title" error={errors.title?.message} required>
          <Input id="article-title" error={Boolean(errors.title)} {...register("title")} />
        </Field>

        <Field
          label="Description"
          htmlFor="article-description"
          error={errors.description?.message}
        >
          <Input
            id="article-description"
            error={Boolean(errors.description)}
            {...register("description")}
          />
        </Field>

        <Field label="Body" htmlFor="article-body" error={errors.body?.message} required>
          <Textarea id="article-body" error={Boolean(errors.body)} {...register("body")} />
        </Field>

        {submitError && (
          <Toast variant="error" title="Couldn't save article" description={submitError} />
        )}

        <Button type="submit" isLoading={isSubmitting} className="self-start">
          {submitLabel}
        </Button>
      </Section>

      <Section className="w-full p-6 lg:w-[376px] lg:shrink-0">
        <Controller
          name="tags"
          control={control}
          render={({ field }) => <TagsPanel selected={field.value} onChange={field.onChange} />}
        />
      </Section>
    </form>
  );
}
