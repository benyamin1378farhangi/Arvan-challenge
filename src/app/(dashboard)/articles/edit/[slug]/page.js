export default async function EditArticlePage({ params }) {
  const { slug } = await params;
  return <p>Edit article {slug} — implemented in Phase 7</p>;
}
