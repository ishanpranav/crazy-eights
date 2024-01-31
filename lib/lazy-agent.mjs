// lazy-agent.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import { suits } from '../lib/cards.mjs';

/* eslint-disable no-unused-vars */

/**
 * Implements the minimal computer agent behavior.
 * 
 * `onReady`: called at the beginning of the agent's turn.
 * `onPlay`: called when the agent has a matching card and must play.
 * `onChangeSuit`: called when the agent has played an eight and must choose its
 *                 suit.
 */
export const lazyAgent = {
    onReady: () => { },
    onPlay: (matches) => {
        return matches[0];
    },
    onChangeSuit: () => {
        return suits[0];
    },
    onDraw: (drawn, played) => { },
    onBeforeWitness: () => { },
    onWitness: (drawn, played, changedSuit) => { },
    onGameOver: () => { }
};

/* eslint-enable no-unused-vars */
