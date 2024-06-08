// src/expression.ts
import { type Tokenizer } from "./Tokenizer";

export function EXPRESSION(tokenizer: Tokenizer): number {
  return TERM(tokenizer);
}

function TERM(tokenizer: Tokenizer): number {
  let result = FACTOR(tokenizer);
  let operation = tokenizer.accept(/[+-]/);
  while (operation) {
    if (operation === "+") result += FACTOR(tokenizer);
    if (operation === "-") result -= FACTOR(tokenizer);
    operation = tokenizer.accept(/[+-]/);
  }
  return result;
}

function FACTOR(tokenizer: Tokenizer): number {
  let result = PRIMARY(tokenizer);
  let operation = tokenizer.accept(/[*\/]/);
  while (operation) {
    if (operation === "*") result *= PRIMARY(tokenizer);
    if (operation === "/") result /= PRIMARY(tokenizer);
    operation = tokenizer.accept(/[*\/]/);
  }
  return result;
}

function PRIMARY(tokenizer: Tokenizer): number {
  if (tokenizer.accept(/[(]/)) {
    const result = EXPRESSION(tokenizer);
    tokenizer.accept(/[)]/);
    return result;
  }

  return NUMBER(tokenizer);
}


function NUMBER(tokenizer: Tokenizer): number {
  return +tokenizer.accept(/\d+/)!;
}