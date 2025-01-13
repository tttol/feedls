import z from "zod";

const schema = z.object({
  rssUrl: z
    .string({
      required_error: "URL is required.",
    })
    .trim()
    .min(1, "URL is required."), // 空白のみの場合もエラー
  title: z
    .string({
      required_error: "Title is required."
    })
    .trim()
    .min(1, "Title is required."), // 空白のみの場合もエラー
});

export const validateForm = (formData: FormData) => {
  const parse = schema.safeParse({
    rssUrl: formData.get("rssUrl"),
    title: formData.get("title"),
  });
  if (!parse.success) {
    throw new Error(`Validation error. ${parse.error}`);
  }
};
