# Markdown Stream Parser by [NLUX](https://docs.nlkit.com/nlux) 🌲✨💬

![Free And Open Source](https://img.shields.io/badge/Free%20%26%20Open%20Source-1ccb61)
[![Docs https://docs.nlkit.com/nlux](https://img.shields.io/badge/Docs_Website-docs.nlkit.com/nlux-fa896b)](https://docs.nlkit.com/nlux)

A lightweight JS/TS library that can be used to parse markdown streams as they are being read or generated.  
It can be useful for LLM-powered applications that need to parse markdown streams in real-time.

This package is part of the [NLUX](https://docs.nlkit.com/nlux) **UI toolkit for AI** ecosystem.

## Usage

```ts
import {
    MarkdownStreamParser,
    MarkdownStreamParserOptions,
    createMarkdownStreamParser,
} from "@nlux/markdown";

const options: MarkdownStreamParserOptions = {
    // markdownLinkTarget?: 'blank' | 'self';                       // default: 'blank'
    // syntaxHighlighter: (( Highlighter from @nlux/highlighter )), // default: undefined — for code blocks syntax highlighting
    // showCodeBlockCopyButton?: boolean,                           // default: true — for code blocks
    // skipStreamingAnimation?: boolean,                            // default: false
    // streamingAnimationSpeed?: number,                            // default: 10 ( milliseconds )
    // onComplete: () => console.log("Parsing complete"),           // triggered after the end of the stream
};

const domElement = document.querySelector(".markdown-container");
const mdStreamParser: MarkdownStreamParser = createMarkdownStreamParser(
    domElement!,
    options,
);

// On each chunk of markdown
mdStreamParser.next("## Hello World");

// To call when the markdown stream is complete
// This indicates to the parser that now additional text will be added
mdStreamParser.complete();
```

## Interfaces

```ts
export type MarkdownStreamParser = {
    next(value: string): void;
    complete(): void;
};
```

```ts
export type MarkdownStreamParserOptions = {
    markdownLinkTarget?: 'blank' | 'self';
    syntaxHighlighter?: HighlighterExtension;
    skipStreamingAnimation?: boolean;
    streamingAnimationSpeed?: number;
    waitTimeBeforeStreamCompletion?: number | 'never';
    showCodeBlockCopyButton?: boolean;
    onComplete?: () => void;
};
```
