import {ConversationStartersProps} from './props';

export const ConversationStarters = (props: ConversationStartersProps) => {
    const {onConversationStarterSelected} = props;
    return (
        <div className="nlux-comp-conversationStarters">
            {props.items.map((conversationStarter, index) => (
                <button
                    key={index}
                    className="nlux-comp-conversationStarter"
                    onClick={() => onConversationStarterSelected(conversationStarter)}
                >
                    <span className="nlux-comp-conversationStarter-prompt">
                        {conversationStarter.prompt}
                    </span>
                </button>
            ))}
        </div>
    );
};
