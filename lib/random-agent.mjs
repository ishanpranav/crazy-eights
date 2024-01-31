// random-agent.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import { suits } from '../lib/cards.mjs';

/* eslint-disable no-unused-vars */

/**
 * Implements a randomized computer agent behavior.
 * 
 * `onReady`: called at the beginning of the agent's turn.
 * `onPlay`: called when the agent has a matching card and must play.
 * `onChangeSuit`: called when the agent has played an eight and must choose its
 *                 suit.
 */
export const randomAgent = {
    onReady: () => { },
    onPlay: (matches) => {
        return matches[Math.floor(Math.random() * matches.length)];
    },
    onChangeSuit: () => {
        return suits[Math.floor(Math.random() * suits.length)];
    },
    onDraw: (drawn, played) => { },
    onBeforeWitness: () => { },
    onWitness: (drawn, played, changedSuit) => { },
    onGameOver: () => { }
};

/* eslint-enable no-unused-vars */
