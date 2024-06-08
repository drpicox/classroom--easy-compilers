import { test, expect } from "vitest";
import { EXPRESSION, Tokenizer } from "../src";

test.each`
  expression | expected
  ${"1"}     | ${1}
  ${"1 "}    | ${1}
  ${" 1"}    | ${1}
  ${"123"}   | ${123}
  ${"1+1"}   | ${2}
  ${"1-1"}   | ${0}
  ${"12+13"} | ${25}
  ${"1+1+1"} | ${3}
  ${"2+3*4"} | ${14}
  ${"(2+3)*4"} | ${20}
`("$expression", ({ expression, expected }) => {
    expect(EXPRESSION(new Tokenizer(expression))).toBe(expected);
});
