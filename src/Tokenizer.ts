// src/Tokenizer.ts
export class Tokenizer {
  #index = 0;
  #text: string;

  constructor(text: string) {
    this.#text = text;
  }

  accept(token: RegExp): string | null {
    this.#skipSpaces();
    const match = token.exec(this.#text.slice(this.#index));
    if (match && match.index === 0) {
      this.#index += match[0].length;
      return match[0];
    }
    return null;
  }

  #skipSpaces() {
    const match = /^\s+/.exec(this.#text.slice(this.#index));
    if (match) {
      this.#index += match[0].length;
    }
  }
}
