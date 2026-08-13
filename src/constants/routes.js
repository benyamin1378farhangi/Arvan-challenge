export const ROUTES = {
  login: "/login",
  register: "/register",
  articles: "/articles",
  articlesPage: (page) => `/articles/page/${page}`,
  createArticle: "/articles/create",
  editArticle: (slug) => `/articles/edit/${slug}`,
};
