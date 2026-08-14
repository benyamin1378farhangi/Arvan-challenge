export const queryKeys = {
  auth: {
    me: ["auth", "me"],
  },
  articles: {
    all: ["articles"],
    list: (page) => ["articles", "list", page],
    localOverrides: ["articles", "localOverrides"],
  },
  tags: {
    all: ["tags"],
  },
};
