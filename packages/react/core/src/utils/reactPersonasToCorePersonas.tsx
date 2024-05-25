import {PersonaOptions} from '@nlux/core';
import {JSX} from 'react';
import {render} from 'react-dom';
import {PersonaOptions as ReactPersonasOptions} from '../exports/personaOptions';

const jsxToHtmlElement = (jsx: JSX.Element): Promise<HTMLElement> => {
    return new Promise((resolve) => {
        const div = document.createElement('div');
        render(jsx, div, () => {
            if (div.children.length !== 1 || !div.firstElementChild) {
                throw new Error('Expected exactly one child');
            }

            resolve(div.firstElementChild as HTMLElement);
        });
    });
};

export const reactPersonasToCorePersonas = async (reactPersonas: ReactPersonasOptions): Promise<PersonaOptions> => {
    const [assistant, user] = await Promise.all([
        (async () => {
            if (!reactPersonas.assistant) {
                return;
            }

            const assistantAvatar = typeof reactPersonas.assistant.picture === 'string' ?
                reactPersonas.assistant.picture :
                await jsxToHtmlElement(reactPersonas.assistant.picture);

            return {
                name: reactPersonas.assistant.name,
                tagline: reactPersonas.assistant.tagline,
                picture: assistantAvatar,
            };
        })(),
        (async () => {
            if (!reactPersonas.user) {
                return;
            }

            const userPicture = typeof reactPersonas.user.picture === 'string' ?
                reactPersonas.user.picture :
                await jsxToHtmlElement(reactPersonas.user.picture);

            return {
                name: reactPersonas.user.name,
                picture: userPicture,
            };
        })(),
    ]);

    return {
        assistant,
        user,
    };
};
