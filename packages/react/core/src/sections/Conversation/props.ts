import {ReactElement} from 'react';
import {ChatSegment} from '@shared/types/chatSegment/chatSegment';
import {MessageOptions} from '../../exports/messageOptions';
import {PersonaOptions} from '../../exports/personaOptions';
import {ConversationOptions} from '../../types/conversationOptions';
import {ConversationStarter} from '../../types/conversationStarter';

export type ConversationCompProps<AiMsg> = {
    segments: ChatSegment<AiMsg>[];
    conversationOptions?: ConversationOptions;
    personaOptions?: PersonaOptions;
    messageOptions?: MessageOptions<AiMsg>;
    loader?: ReactElement;
    onConversationStarterSelected: (
        conversationStarter: ConversationStarter,
    ) => void;
    onLastActiveSegmentChange?: (data: {
        uid: string;
        div: HTMLDivElement;
    } | undefined) => void;
};

export type ImperativeConversationCompProps<AiMsg> = {
    streamChunk: (segmentId: string, messageId: string, chunk: AiMsg) => void;
    completeStream: (segmentId: string, messageId: string) => void;
};