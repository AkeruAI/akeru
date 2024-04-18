export const UNAUTHORIZED_MISSING_TOKEN = {
  message: "Unauthorized: Missing token",
  code: 401,
};

export const UNAVAILABLE_BODY = {
  context: {
    body: {
      name: "",
      model: "gpt-4",
      instruction: "",
    },
  },
};
