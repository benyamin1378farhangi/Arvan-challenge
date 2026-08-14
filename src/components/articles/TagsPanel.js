"use client";

import { useMemo, useState } from "react";
import Input from "@/components/ui/Input";
import Checkbox from "@/components/ui/Checkbox";
import { useTags } from "@/hooks/useTags";

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// One input does double duty, matching Figma's single "New tag" field:
// typing filters the checkbox list, and Enter either checks an existing
// tag that matches or adds a brand-new one (auto-checked, per the Figma
// tips note). New tags are local-only — DummyJSON has no endpoint that
// would actually persist a new tag, so this never claims otherwise.
export default function TagsPanel({ selected, onChange }) {
  const { data: tags = [], isLoading } = useTags();
  const [search, setSearch] = useState("");
  const [customTags, setCustomTags] = useState([]);

  const allTags = useMemo(() => {
    const bySlug = new Map([...tags, ...customTags].map((tag) => [tag.slug, tag]));
    return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [tags, customTags]);

  const visibleTags = search
    ? allTags.filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase()))
    : allTags;

  const toggleTag = (slug) => {
    onChange(
      selected.includes(slug)
        ? selected.filter((value) => value !== slug)
        : [...selected, slug],
    );
  };

  const handleSearchKeyDown = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();

    const value = search.trim();
    if (!value) return;

    const slug = slugify(value);
    if (!slug) return;

    if (!allTags.some((tag) => tag.slug === slug)) {
      setCustomTags((current) => [...current, { slug, name: value }]);
    }
    if (!selected.includes(slug)) {
      onChange([...selected, slug]);
    }
    setSearch("");
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-body-2 tracking-body-2 font-semibold text-neutral-fg1">Tags</p>

      <Input
        placeholder="New tag"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        onKeyDown={handleSearchKeyDown}
        aria-label="Search or add a tag"
      />

      <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
        {isLoading && (
          <p className="text-caption-1 tracking-caption-1 text-neutral-fg2">
            Loading tags…
          </p>
        )}
        {!isLoading &&
          visibleTags.map((tag) => (
            <Checkbox
              key={tag.slug}
              id={`tag-${tag.slug}`}
              label={tag.name}
              checked={selected.includes(tag.slug)}
              onChange={() => toggleTag(tag.slug)}
            />
          ))}
        {!isLoading && visibleTags.length === 0 && (
          <p className="text-caption-1 tracking-caption-1 text-neutral-fg2">
            No matching tags. Press Enter to add &quot;{search}&quot;.
          </p>
        )}
      </div>
    </div>
  );
}
