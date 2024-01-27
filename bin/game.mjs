// game.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import { readFile } from 'fs';
import { playerAgent } from '../bin/player-agent.mjs';
import {
    deal, draw, drawUntilPlayable, eight, generateDeck, matchesAnyProperty,
} from '../lib/cards.mjs';
import { fisherYatesShuffle } from '../lib/fisher-yates-shuffle.mjs';

function createDefaultState() {
    let result = {
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
        discarded = [...result.discardPile, ...discarded];
    } while (result.nextPlay.rank === eight);

    return result;
}

function gameTerminated(state) {
    return !state.playerHand.length ||
        !state.computerHand.length ||
        !state.deck.length;
}

function playCrazyEights(state) {
    const agents = [playerAgent];

    while (!gameTerminated(state)) {
        const matches = [];

        for (const card of state.playerHand) {
            if (matchesAnyProperty(card, state.nextPlay)) {
                matches.push(card);
            }
        }

        for (const agent of agents) {
            agent.onReady(state);

            let played;

            if (matches.length) {
                played = agent.onPlay(matches, state);
            } else {
                let drawn;
            
                [state.deck, drawn] = drawUntilPlayable(state.deck, state.nextPlay);
                state.playerHand = [...state.playerHand, ...drawn];
                played = drawn[drawn.length - 1];

                agent.onDraw(drawn, played, state);
            }

            if (played.rank === eight) {
                played.suit = agent.onChangeSuit(state);
            }

            state.playerHand.splice(state.playerHand.indexOf(played), 1);
            state.discardPile.push(state.nextPlay);

            state.nextPlay = played;
        }
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

            playCrazyEights(JSON.parse(data));
        });

        return;
    }

    playCrazyEights(createDefaultState());
}

main();

console.log(12004);
