// game.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import { readFile } from 'fs';
import {
    deal, draw, drawUntilPlayable, eight, generateDeck, matchesAnyProperty,
} from '../lib/cards.mjs';
import { fisherYatesShuffle } from '../lib/fisher-yates-shuffle.mjs';

import { playerAgent } from '../bin/player-agent.mjs';
import { lazyAgent } from '../lib/lazy-agent.mjs';

// Plays a full game, not just two turns

// Use `computerAgent` to control the AI behavior

const computerAgent = lazyAgent;

function createDefaultState() {
    const result = {
        deck: generateDeck(),
        discardPile: []
    };

    fisherYatesShuffle(result.deck);

    let discarded;
    const { deck, hands } = deal(result.deck);

    result.deck = deck;
    [result.playerHand, result.computerHand] = hands;

    do {
        if (result.nextPlay) {
            result.discardPile.push(result.nextPlay);
        }

        [result.deck, [result.nextPlay, ...discarded]] = draw(result.deck);
        result.discardPile = [...result.discardPile, ...discarded];
    } while (result.nextPlay.rank === eight);

    return result;
}

function isGameOver(state) {
    return !state.playerHand.length ||
        !state.computerHand.length ||
        !state.deck.length;
}

function playTurn(state, agent, witness, hand) {
    agent.onReady(state);
    
    const matches = [];

    for (const card of hand) {
        if (matchesAnyProperty(card, state.nextPlay)) {
            matches.push(card);
        }
    }

    let drawn;
    let played;
    let changedSuit;
    
    if (matches.length) {
        played = agent.onPlay(matches);
    } else {
        const partition = drawUntilPlayable(state.deck, state.nextPlay);

        [state.deck, drawn] = partition;
        hand = [...hand, ...drawn];
        played = drawn[drawn.length - 1];

        agent.onDraw(drawn, played);
    }

    if (!played) {
        state.deck = []; // Unresponsive AI or not enough cards

        return hand;
    }

    if (played.rank === eight) {
        changedSuit = agent.onChangeSuit();
    }

    hand.splice(hand.indexOf(played), 1);
    state.discardPile.push(state.nextPlay);

    state.nextPlay = played;
    
    witness.onWitness(drawn, played, changedSuit);

    if (played.rank === eight) {
        played.suit = changedSuit; // Bad hack
    }

    return hand;
}

function playGame(state) {
    while (!isGameOver(state)) {
        state.playerHand = playTurn(
            state, 
            playerAgent, 
            computerAgent,
            state.playerHand);
        state.computerHand = playTurn(
            state,
            computerAgent,
            playerAgent,
            state.computerHand);
    }

    for (const agent of agents) {
        agent.onGameOver(state);
    }
}

function main() {
    if (process.argv.length > 2) {
        readFile(process.argv[2], (err, data) => {
            if (err) {
                throw err;
            }

            playGame(JSON.parse(data));
        });

        return;
    }

    playGame(createDefaultState());
}

main();
