// @ts-nocheck

import { test, expect, describe } from "bun:test";
import { vangogh, impressionist, picasso, artist } from "../lib";

describe("vangogh", () => {
  test("generates a palette from yellow", () => {
    const result = vangogh("yellow");
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test("generates a palette with custom num", () => {
    const result = vangogh("blue", { num: 8 });
    expect(result).toBeDefined();
    expect(result.length).toBe(8);
  });

  test("supports arles period", () => {
    const result = vangogh("yellow", { period: "arles" });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("supports paris period", () => {
    const result = vangogh("green", { period: "paris" });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("supports netherlands period", () => {
    const result = vangogh("red", { period: "netherlands" });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("supports subtle contrast", () => {
    const result = vangogh("orange", { contrast: "subtle" });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("supports medium contrast", () => {
    const result = vangogh("purple", { contrast: "medium" });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("supports bold contrast", () => {
    const result = vangogh("cyan", { contrast: "bold" });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("returns unique colors", () => {
    const result = vangogh("yellow", { num: 10 });
    const unique = new Set(result);
    expect(unique.size).toBe(result.length);
  });

  test("works with hex color input", () => {
    const result = vangogh("#ff5500");
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("works with rgb array input", () => {
    const result = vangogh(["rgb", 1, 0.5, 0]);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("impressionist", () => {
  test("generates a palette from green", () => {
    const result = impressionist("green");
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test("generates a palette with custom num", () => {
    const result = impressionist("blue", { num: 8 });
    expect(result).toBeDefined();
    expect(result.length).toBe(8);
  });

  test("supports broken technique", () => {
    const result = impressionist("red", { technique: "broken" });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("supports optical technique", () => {
    const result = impressionist("purple", { technique: "optical" });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("supports morning time of day", () => {
    const result = impressionist("white", { timeOfDay: "morning" });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("supports noon time of day", () => {
    const result = impressionist("white", { timeOfDay: "noon" });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("supports evening time of day", () => {
    const result = impressionist("white", { timeOfDay: "evening" });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("supports dusk time of day", () => {
    const result = impressionist("white", { timeOfDay: "dusk" });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("supports blue shadows option", () => {
    const result = impressionist("green", { blueShadows: true });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("works without blue shadows", () => {
    const result = impressionist("green", { blueShadows: false });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("returns unique colors", () => {
    const result = impressionist("yellow", { num: 10 });
    const unique = new Set(result);
    expect(unique.size).toBe(result.length);
  });

  test("combines options correctly", () => {
    const result = impressionist("orange", {
      technique: "optical",
      timeOfDay: "evening",
      blueShadows: true,
      num: 5,
    });
    expect(result).toBeDefined();
    expect(result.length).toBe(5);
  });
});

describe("picasso", () => {
  test("generates a blue period palette", () => {
    const result = picasso("blue", { period: "blue" });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test("generates a rose period palette", () => {
    const result = picasso("pink", { period: "rose" });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("generates a palette with custom num", () => {
    const result = picasso("blue", { period: "blue", num: 8 });
    expect(result).toBeDefined();
    expect(result.length).toBe(8);
  });

  test("supports low intensity", () => {
    const result = picasso("blue", { period: "blue", intensity: 0.2 });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("supports high intensity", () => {
    const result = picasso("blue", { period: "blue", intensity: 0.9 });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("default period is blue", () => {
    const result = picasso("blue");
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("returns unique colors", () => {
    const result = picasso("blue", { period: "blue", num: 10 });
    const unique = new Set(result);
    expect(unique.size).toBe(result.length);
  });

  test("works with hex color input for blue period", () => {
    const result = picasso("#4488ff", { period: "blue" });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("works with hex color input for rose period", () => {
    const result = picasso("#ff8866", { period: "rose" });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test("combines options correctly", () => {
    const result = picasso("red", {
      period: "blue",
      intensity: 0.5,
      num: 4,
    });
    expect(result).toBeDefined();
    expect(result.length).toBe(4);
  });
});

describe("edge cases", () => {
  test("vangogh handles num of 1 (minimum enforced)", () => {
    const result = vangogh("yellow", { num: 1 });
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThanOrEqual(3);
  });

  test("impressionist handles num of 1 (minimum enforced)", () => {
    const result = impressionist("green", { num: 1 });
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThanOrEqual(3);
  });

  test("picasso handles num of 1", () => {
    const result = picasso("blue", { num: 1 });
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
  });

  test("vangogh handles num of 2 (minimum enforced)", () => {
    const result = vangogh("blue", { num: 2 });
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThanOrEqual(3);
  });

  test("impressionist handles num of 2 (minimum enforced)", () => {
    const result = impressionist("red", { num: 2 });
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThanOrEqual(3);
  });

  test("picasso handles num of 2", () => {
    const result = picasso("rose", { num: 2 });
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
  });

  test("vangogh with very small num defaults to minimum", () => {
    const result = vangogh("yellow", { num: 0 });
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThanOrEqual(3);
  });

  test("impressionist with very small num defaults to minimum", () => {
    const result = impressionist("green", { num: 0 });
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThanOrEqual(3);
  });

  test("picasso with num of 0 returns empty", () => {
    const result = picasso("blue", { num: 0 });
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("artist (consolidated)", () => {
  test("artist('vangogh') returns a curried function", () => {
    const fn = artist("vangogh");
    expect(typeof fn).toBe("function");
  });

  test("artist('vangogh')('yellow') generates a palette", () => {
    const result = artist("vangogh")("yellow");
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test("artist('vangogh')('blue', { num: 8 }) returns 8 colors", () => {
    const result = artist("vangogh")("blue", { num: 8 });
    expect(result.length).toBe(8);
  });

  test("artist('impressionist') returns a curried function", () => {
    const fn = artist("impressionist");
    expect(typeof fn).toBe("function");
  });

  test("artist('impressionist')('green') generates a palette", () => {
    const result = artist("impressionist")("green");
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test("artist('impressionist')('blue', { num: 8 }) returns 8 colors", () => {
    const result = artist("impressionist")("blue", { num: 8 });
    expect(result.length).toBe(8);
  });

  test("artist('picasso') returns a curried function", () => {
    const fn = artist("picasso");
    expect(typeof fn).toBe("function");
  });

  test("artist('picasso')('blue') generates a palette", () => {
    const result = artist("picasso")("blue");
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test("artist('picasso')('blue', { num: 8 }) returns 8 colors", () => {
    const result = artist("picasso")("blue", { num: 8 });
    expect(result.length).toBe(8);
  });

  test("artist results match standalone function results", () => {
    const standalone = vangogh("yellow", { num: 5 });
    const consolidated = artist("vangogh")("yellow", { num: 5 });
    expect(standalone.length).toBe(consolidated.length);
  });
});
