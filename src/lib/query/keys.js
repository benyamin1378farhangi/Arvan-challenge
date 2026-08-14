export const queryKeys = {
  articles: {
    all: ["articles"],
    list: (page) => ["articles", "list", page],
  },
  tags: {
    all: ["tags"],
  },
};
