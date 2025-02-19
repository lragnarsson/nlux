import {ChatSegmentItem} from '@shared/types/chatSegment/chatSegment';
import {ChatItemProps} from '@shared/components/ChatItem/props';
import {domOp} from '@shared/utils/dom/domOp';
import {warnOnce} from '@shared/utils/warn';
import {BaseComp} from '../../../aiChat/comp/base';
import {comp} from '../../../aiChat/comp/comp';
import {CompEventListener, Model} from '../../../aiChat/comp/decorators';
import {HighlighterExtension} from '../../../aiChat/highlighter/highlighter';
import {ConversationLayout} from '../../../aiChat/options/conversationOptions';
import {AssistantPersona, UserPersona} from '../../../aiChat/options/personaOptions';
import {ControllerContext} from '../../../types/controllerContext';
import {CompChatItem} from '../chatItem/chatItem.model';
import {CompChatItemProps} from '../chatItem/chatItem.types';
import {renderChatSegment} from './chatSegment.render';
import {
    CompChatSegmentActions,
    CompChatSegmentElements,
    CompChatSegmentEvents,
    CompChatSegmentProps,
} from './chatSegment.types';
import {updateChatSegment} from './chatSegment.update';
import {getChatItemPropsFromSegmentItem} from './utils/getChatItemProps';

@Model('chatSegment', renderChatSegment, updateChatSegment)
export class CompChatSegment<AiMsg> extends BaseComp<
    AiMsg, CompChatSegmentProps, CompChatSegmentElements, CompChatSegmentEvents, CompChatSegmentActions
> {
    private chatItemCompIdsByIndex: string[] = [];
    private chatItemComponentsById: Map<string, CompChatItem<AiMsg>> = new Map();

    constructor(
        context: ControllerContext<AiMsg>,
        props: CompChatSegmentProps,
    ) {
        super(context, props);
    }

    public addChatItem(item: ChatSegmentItem<AiMsg>) {
        this.throwIfDestroyed();
        if (this.chatItemComponentsById.has(item.uid)) {
            throw new Error(`CompChatSegment: chat item with id "${item.uid}" already exists`);
        }

        const compChatItemProps: ChatItemProps | undefined = getChatItemPropsFromSegmentItem(
            item,
            this.getProp('conversationLayout') as ConversationLayout | undefined,
            this.getProp('userPersona') as UserPersona | undefined,
            this.getProp('assistantPersona') as AssistantPersona | undefined,
        );

        if (!compChatItemProps) {
            throw new Error(`CompChatSegment: chat item with id "${item.uid}" has invalid props`);
        }

        const newChatItemComp = comp(CompChatItem<AiMsg>)
            .withContext(this.context)
            .withProps({
                uid: item.uid,
                domProps: compChatItemProps,
                markdownLinkTarget: this.getProp('markdownLinkTarget') as 'blank' | 'self' | undefined,
                showCodeBlockCopyButton: this.getProp('showCodeBlockCopyButton') as boolean | undefined,
                skipStreamingAnimation: this.getProp('skipStreamingAnimation') as boolean | undefined,
                syntaxHighlighter: this.getProp('syntaxHighlighter') as HighlighterExtension | undefined,
                htmlSanitizer: this.getProp('htmlSanitizer') as ((html: string) => string) | undefined,
                streamingAnimationSpeed: this.getProp('streamingAnimationSpeed') as number | undefined,
            } satisfies CompChatItemProps)
            .create();

        // Add the chat item to the list of chat items
        this.chatItemComponentsById.set(item.uid, newChatItemComp);
        this.chatItemCompIdsByIndex.push(item.uid);

        if (!this.rendered) {
            // If the chat segment is not rendered, we don't need to render the chat item yet!
            return;
        }

        if (!this.renderedDom?.elements?.chatSegmentContainer) {
            warnOnce('CompChatSegment: chatSegmentContainer is not available');
            return;
        }

        newChatItemComp.render(
            this.renderedDom.elements.chatSegmentContainer,
            this.renderedDom.elements.loaderContainer,
        );
    }

    public addChunk(
        chatItemId: string,
        chunk: AiMsg,
        serverResponse?: string | object | undefined,
    ) {
        if (this.destroyed) {
            return;
        }

        const chatItem = this.chatItemComponentsById.get(chatItemId);
        if (!chatItem) {
            throw new Error(`CompChatSegment: chat item with id "${chatItemId}" not found`);
        }

        chatItem.addChunk(chunk, serverResponse);
    }

    public complete() {
        this.throwIfDestroyed();
        this.chatItemComponentsById.forEach((comp) => comp.commitChunks());
        this.setProp('status', 'complete');
    }

    destroy() {
        this.chatItemComponentsById.forEach((comp) => comp.destroy());
        this.chatItemComponentsById.clear();
        this.chatItemCompIdsByIndex = [];
        super.destroy();
    }

    public getChatItems() {
        return this.chatItemCompIdsByIndex.map(
            (id) => this.chatItemComponentsById.get(id),
        ).filter((comp) => !!comp) as CompChatItem<AiMsg>[];
    }

    public setAssistantPersona(assistantPersona: AssistantPersona | undefined) {
        this.setProp('assistantPersona', assistantPersona);
        const newProps: Partial<ChatItemProps> = {
            name: assistantPersona?.name,
            avatar: assistantPersona?.avatar,
        };

        this.chatItemComponentsById.forEach((comp) => {
            if (comp.getChatSegmentItem().participantRole === 'assistant') {
                comp.updateDomProps(newProps);
            }
        });
    }

    public setLayout(conversationLayout: ConversationLayout) {
        this.setProp('conversationLayout', conversationLayout);
        this.chatItemComponentsById.forEach((comp) => {
            comp.updateDomProps({
                layout: conversationLayout,
            });
        });
    }

    public setUserPersona(userPersona: UserPersona | undefined) {
        this.setProp('userPersona', userPersona);
        const newProps: Partial<ChatItemProps> = {
            name: userPersona?.name,
            avatar: userPersona?.avatar,
        };

        this.chatItemComponentsById.forEach((comp) => {
            if (comp.getChatSegmentItem().participantRole === 'user') {
                comp.updateDomProps(newProps);
            }
        });
    }

    public updateMarkdownStreamRenderer(
        newProp: keyof CompChatSegmentProps,
        newValue: CompChatSegmentProps[keyof CompChatSegmentProps],
    ) {
        this.setProp(newProp, newValue);
    }

    @CompEventListener('loader-shown')
    onLoaderShown(loader: HTMLElement) {
        if (this.renderedDom?.elements) {
            this.renderedDom.elements.loaderContainer = loader;
        }
    }

    protected setProp<K extends keyof CompChatSegmentProps>(key: K, value: CompChatSegmentProps[K]) {
        super.setProp(key, value);

        if (
            key === 'markdownLinkTarget' || key === 'syntaxHighlighter' || key === 'htmlSanitizer' ||
            key === 'skipStreamingAnimation' || key === 'streamingAnimationSpeed'
        ) {
            this.chatItemComponentsById.forEach((comp) => {
                comp.updateMarkdownStreamRenderer(
                    key satisfies keyof CompChatItemProps,
                    value as CompChatItemProps[keyof CompChatItemProps],
                );
            });
        }
    }

    @CompEventListener('chat-segment-ready')
    private onChatSegmentReady() {
        domOp(() => {
            if (!this.renderedDom?.elements?.chatSegmentContainer) {
                return;
            }

            const chatSegmentContainer = this.renderedDom?.elements?.chatSegmentContainer;
            this.chatItemComponentsById.forEach((comp) => {
                if (!comp.rendered) {
                    comp.render(chatSegmentContainer);
                }
            });
        });
    }

    @CompEventListener('loader-hidden')
    private onLoaderHidden() {
        if (this.renderedDom?.elements) {
            this.renderedDom.elements.loaderContainer = undefined;
        }
    }
}
