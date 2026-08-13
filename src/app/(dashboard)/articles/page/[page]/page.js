export default async function ArticlesPagedPage({ params }) {
  const { page } = await params;
  return <p>Articles list (page {page}) — implemented in Phase 5</p>;
}
