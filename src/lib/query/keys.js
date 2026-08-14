export const queryKeys = {
  articles: {
    all: ["articles"],
    list: (page) => ["articles", "list", page],
    localOverrides: ["articles", "localOverrides"],
  },
  tags: {
    all: ["tags"],
  },
};
