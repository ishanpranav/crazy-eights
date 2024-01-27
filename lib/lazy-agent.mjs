// lazy-agent.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import { suits } from '../lib/cards.mjs';

/**
 * Implements the minimal computer agent behavior.
 * 
 * `onReady`: called at the beginning of the agent's turn.
 * `onPlay`: called when the agent has a matching card and must play.
 * `onChangeSuit`: called when the agent has played an eight and must choose its
 *                 suit.
 * `onDraw`: called after the agent has drawn.
 * `onWitness`: called after any other agent has played a turn.
 * `onGameOver`: called when the game is over.
 */
export const lazyAgent = {
    onReady: (state) => {
        lazyAgent.state = state;
    },
    onPlay: (matches) => {
        return matches[0];
    },
    onChangeSuit: () => {
        return suits[0];
    },
    onDraw: (drawn, played) => {
        
    },
    onWitness: (drawn, played, changedSuit) => {

    },
    onGameOver: () => {

    }
};
