import { describe, expect, it } from "vitest";
import { validateForm } from "./validation";

describe("validateForm関数のテスト", () => {
  it("正常系", () => {
    const formData = new FormData();
    formData.set("rssUrl", "https://example.com/rss");
    formData.set("title", "Example Title");

    expect(() => validateForm(formData)).not.toThrow();
  });

  it("rssUrlが不足している場合にエラーが発生する", () => {
    const formData = new FormData();
    formData.set("title", "Example Title");

    expect(() => validateForm(formData)).toThrow(Error);
  });

  it("titleが不足している場合にエラーが発生する", () => {
    const formData = new FormData();
    formData.set("rssUrl", "https://example.com/rss");

    expect(() => validateForm(formData)).toThrow(Error);
  });

  it("rssUrlとtitleが両方不足している場合にエラーが発生する", () => {
    const formData = new FormData();

    expect(() => validateForm(formData)).toThrow(Error);
  });

  it("rssUrlが空白のみの場合にエラーが発生する", () => {
    const formData = new FormData();
    formData.set("rssUrl", "   ");
    formData.set("title", "Example Title");

    expect(() => validateForm(formData)).toThrow(Error);
  });

  it("titleが空白のみの場合にエラーが発生する", () => {
    const formData = new FormData();
    formData.set("rssUrl", "https://example.com/rss");
    formData.set("title", "   ");

    expect(() => validateForm(formData)).toThrow(Error);
  });
});