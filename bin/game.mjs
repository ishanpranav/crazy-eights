// game.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import clear from 'clear';
import { readFile } from 'fs';
import { question } from 'readline-sync';
import {
    cardToString, deal, draw, eight, generateDeck, handToString,
    matchesAnyProperty
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

        result.discardPile.concat(discarded);
    } while (result.nextPlay.rank === eight);

    return result;
}

function topOfDiscardPile(state) {
    if (state.discardPile.length == 0) {
        return null;
    }

    return state.discardPile[state.discardPile.length - 1];
}

function displayState(state) {
    console.log(`
                      CR🤪ZY 8's
    -----------------------------------------------
    Next suit/rank to play: ➡️  ${cardToString(state.nextPlay)}  ⬅️
    -----------------------------------------------
    Top of discard pile: ${cardToString(topOfDiscardPile(state))}
    Number of cards left in deck: ${state.deck.length}
    -----------------------------------------------
    🤖✋ (computer hand): ${handToString(state.computerHand)}
    😊✋ (player hand): ${handToString(state.playerHand)}
    -----------------------------------------------`);
}

function requestCard(matches) {
    let input;

    do {
        console.log(`
    😊 Player's turn...
    Enter the number of the card you would like to
    play
    
    `, handToString(matches, "\n     ", true), '\n');

        input = Number(question("    >"));
    } while (isNaN(input) || input < 1 || input > matches.length);

    return matches[input - 1];
}

function playCrazyEights(state) {
    displayState(state);

    const matches = [];

    for (const card of state.playerHand) {
        if (matchesAnyProperty(card, state.nextPlay)) {
            matches.push(card);
        }
    }

    if (matches.length == 0) {
        return;
    }

    const card = requestCard(matches);

    state.playerHand.splice(state.playerHand.indexOf(card), 1);
    state.discardPile.push(state.nextPlay);

    state.nextPlay = card;
    
    console.log(state)
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
