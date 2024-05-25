/**
 * The role of a participant in a conversation.
 *
 * The 'ai' role is used to represent the AI model responding to the user.
 * The 'system' role is used to represent the system sending messages to the assistant to control its behavior.
 * The 'user' role is used to represent the user sending messages to the assistant.
 */
export type ParticipantRole = 'user' | 'system' | 'ai';
