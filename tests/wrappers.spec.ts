// @ts-nocheck

import { test, expect, describe } from "bun:test";
import { Color, ColorArray } from "../lib";

describe("Color", () => {
  describe("alpha", () => {
    test("gets alpha value", () => {
      const c = new Color("#ff0000");
      const alpha = c.alpha();
      expect(typeof alpha).toBe("number");
    });

    test("sets alpha and modifies the bound color", () => {
      const c = new Color("#ff0000");
      c.alpha(0.5);
      expect(c.output()).toBeTruthy();
    });

    test("sets alpha to 0 (falsy edge case)", () => {
      const c = new Color("#ff0000");
      c.alpha(0);
      expect(c.output()).toBeTruthy();
      const alpha = new Color(c.output()).alpha();
      expect(alpha).toBe(0);
    });

    test("returns Color instance when implicitReturn is false", () => {
      const c = new Color("blue", { implicitReturn: false });
      const result = c.alpha(0.3);
      expect(result).toBeInstanceOf(Color);
      expect(result.output()).toBeTruthy();
    });

    test("returns color directly when implicitReturn is true", () => {
      const result = new Color("green", { implicitReturn: true }).alpha(0.7);
      expect(result).toBeTruthy();
    });
  });

  describe("luminance", () => {
    test("gets luminance value", () => {
      const c = new Color("pink");
      const lum = c.luminance();
      expect(typeof lum).toBe("number");
    });

    test("sets luminance and modifies the bound color", () => {
      const c = new Color("pink");
      c.luminance(0.5);
      expect(c.output()).toBeTruthy();
    });

    test("sets luminance to 0 (falsy edge case)", () => {
      const c = new Color("black");
      c.luminance(0);
      expect(c.output()).toBeTruthy();
    });
  });

  describe("saturation", () => {
    test("gets saturation value", () => {
      const c = new Color("red");
      const sat = c.saturation();
      expect(typeof sat).toBe("number");
    });

    test("sets saturation and modifies the bound color", () => {
      const c = new Color("red");
      c.saturation(50);
      expect(c.output()).toBeTruthy();
    });

    test("sets saturation to 0 (falsy edge case)", () => {
      const c = new Color("red");
      c.saturation(0);
      expect(c.output()).toBeTruthy();
    });
  });

  describe("achromatic", () => {
    test("returns boolean for chromatic color", () => {
      const result = new Color("pink").achromatic();
      expect(typeof result).toBe("boolean");
    });

    test("returns boolean for gray color", () => {
      const result = new Color("gray").achromatic();
      expect(typeof result).toBe("boolean");
    });
  });

  describe("temp", () => {
    test("returns warm or cool for a color", () => {
      const result = new Color("pink").temp();
      expect(result === "warm" || result === "cool").toBe(true);
    });
  });

  describe("contrast", () => {
    test("returns a number", () => {
      const result = new Color("pink").contrast("yellow");
      expect(typeof result).toBe("number");
    });
  });

  describe("output", () => {
    test("returns the bound color", () => {
      const result = new Color("red").output();
      expect(result).toBeTruthy();
    });
  });

  describe("chaining", () => {
    test("supports multiple chained calls", () => {
      const result = new Color("blue", { implicitReturn: false })
        .alpha(0.8)
        .saturation(60)
        .output();
      expect(result).toBeTruthy();
    });
  });
});

describe("ColorArray", () => {
  const sample = ["blue", "pink", "yellow", "green"];

  test("creates instance with colors array", () => {
    const ca = new ColorArray(sample);
    expect(ca.colors).toBeDefined();
    expect(ca.colors.length).toBe(4);
  });

  test("nearest with options object returns collection via output()", () => {
    const result = new ColorArray(sample)
      .nearest({ against: "blue", num: 2 })
      .output();
    expect(Array.isArray(result)).toBe(true);
  });

  test("output returns the underlying collection", () => {
    const result = new ColorArray(sample).output();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(4);
  });

  test("distribute returns result", () => {
    const result = new ColorArray(sample)
      .distribute({ factor: ["chroma"], extremum: "max" })
      .output();
    expect(result).toBeTruthy();
  });

  test("filterBy returns ColorArray instance when implicitReturn is false", () => {
    const result = new ColorArray(sample).filterBy({
      start: ">=100",
      factor: "hue",
    });
    expect(result).toBeInstanceOf(ColorArray);
  });

  test("filterBy returns collection with implicitReturn true", () => {
    const result = new ColorArray(sample, true).filterBy({
      start: ">=100",
      factor: "hue",
    });
    expect(result).toBeTruthy();
  });
});
