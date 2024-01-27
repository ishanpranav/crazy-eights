// game.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import clear from 'clear';
import { readFile } from 'fs';
import { question } from 'readline-sync';
import { 
    cardToString, deal, draw, eight, generateDeck, handToString 
} from '../lib/cards.mjs';
import { fisherYatesShuffle } from '../lib/fisher-yates-shuffle.mjs';

function createDefaultState() {
    let result = {
        deck: generateDeck(),
        discard: []
    };

    fisherYatesShuffle(result.deck);

    let discarded;
    const { deck, hands } = deal(result.deck);

    result.deck = deck;
    [result.playerHand, result.computerHand] = hands;

    do {
        if (result.nextPlay) {
            result.discard.push(result.nextPlay);
        }

        [result.deck, [result.nextPlay, ...discarded]] = draw(result.deck);

        result.discard.concat(discarded);
    } while (result.nextPlay.rank === eight);

    return result;
}

function topOfDiscard(state) {
    if (state.discard.length == 0) {
        return null;
    }

    return state.discard[state.discard.length - 1];
}

function displayState(state) {
    console.log(`
                      CR🤪ZY 8's
    -----------------------------------------------
    Next suit/rank to play: ➡️  ${cardToString(state.nextPlay)}  ⬅️
    -----------------------------------------------
    Top of discard pile: ${cardToString(topOfDiscard(state))}
    Number of cards left in deck: ${state.deck.length}
    -----------------------------------------------
    🤖✋ (computer hand): ${handToString(state.computerHand)}
    😊✋ (player hand): ${handToString(state.playerHand)}
    -----------------------------------------------`);
}

function playCrazyEights(state) {
    displayState(state);
}

if (process.argv.length > 2) {
    readFile(process.argv[2], (err, data) => {
        if (err) {
            throw err;
        }

        playCrazyEights(JSON.parse(data));
    });
} else {
    playCrazyEights(createDefaultState());
}

console.log(12004);
