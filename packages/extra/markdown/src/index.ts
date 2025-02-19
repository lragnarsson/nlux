import {HighlighterExtension, SanitizerExtension} from '../../../js/core/src';
import {createMdStreamRenderer} from '../../../shared/src/markdown/stream/streamParser';
import {CallbackFunction} from '../../../shared/src/types/callbackFunction';

export type MarkdownStreamParser = {
    next(value: string): void;
    complete(): void;
};

export type MarkdownStreamParserOptions = {
    markdownLinkTarget?: 'blank' | 'self';
    syntaxHighlighter?: HighlighterExtension;
    htmlSanitizer?: SanitizerExtension;
    skipStreamingAnimation?: boolean;
    streamingAnimationSpeed?: number;
    waitTimeBeforeStreamCompletion?: number | 'never';
    showCodeBlockCopyButton?: boolean;
    onComplete?: CallbackFunction;
};

export const createMarkdownStreamParser = (
    domElement: HTMLElement,
    options?: MarkdownStreamParserOptions,
): MarkdownStreamParser => {
    const nluxMarkdownStreamRenderer = createMdStreamRenderer(
        domElement,
        {
            syntaxHighlighter: options?.syntaxHighlighter,
            htmlSanitizer: options?.htmlSanitizer,
            markdownLinkTarget: options?.markdownLinkTarget,
            showCodeBlockCopyButton: options?.showCodeBlockCopyButton,
            skipStreamingAnimation: options?.skipStreamingAnimation,
            streamingAnimationSpeed: options?.streamingAnimationSpeed,
            waitTimeBeforeStreamCompletion: options?.waitTimeBeforeStreamCompletion,
            onComplete: options?.onComplete,
        },
    );

    return {
        next(value: string) {
            nluxMarkdownStreamRenderer.next(value);
        },
        complete() {
            nluxMarkdownStreamRenderer.complete();
        },
    };
};
