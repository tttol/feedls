import z from "zod";

const schema = z.object({
  rssUrl: z
    .string({
      required_error: "URL is required.",
    })
    .trim(),
});

export const validateForm = (formData: FormData) => {
  const parse = schema.safeParse({
    rssUrl: formData.get("rssUrl"),
  });
  if (!parse.success) {
    throw new Error(`Validation error. ${parse.error}`);
  }
};
