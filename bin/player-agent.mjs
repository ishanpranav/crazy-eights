// player-agent.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import clear from 'clear';
import { question } from 'readline-sync';
import { cardToString, eight, handToString, suits } from '../lib/cards.mjs';

function topOfDiscardPile(state) {
    if (!state.discardPile.length) {
        return null;
    }

    return state.discardPile[state.discardPile.length - 1];
}

export const playerAgent = {
    onReady: (state) => {
        playerAgent.state = state;
        
        clear();
        console.log(`
                        CR🤪ZY 8's
    -----------------------------------------------
    Next suit/rank to play: ➡️  ${cardToString(playerAgent.state.nextPlay)}  ⬅️
    -----------------------------------------------
    Top of discard pile: ${cardToString(topOfDiscardPile(playerAgent.state))}
    Number of cards left in deck: ${playerAgent.state.deck.length}
    -----------------------------------------------
    🤖✋ (computer hand): ${handToString(playerAgent.state.computerHand)}
    😊✋ (player hand): ${handToString(playerAgent.state.playerHand)}
    -----------------------------------------------
    😊 Player's turn...`);
    },
    onPlay: (matches) => {
        let input;

        do {
            console.log(`
    Enter the number of the card you would like to
    play

    ${handToString(matches, "\n    ", true)}`);

            input = Number(question("   >"));
        } while (isNaN(input) || input < 1 || input > matches.length);

        return matches[input - 1];
    },
    onChangeSuit: () => {
        let input;

        do {
            console.log(`
    CRAZY EIGHTS! You played an 8 - choose a suit
    1: ♠️
    2: ❤️
    3: ♣️
    4: ♦️`);

            input = question("   >");
        } while (isNaN(input) || input < 1 || input > suits.length);

        return suits[input - 1];
    },
    onDraw: (drawn, played) => {
        const possibilities = [
            playerAgent.state.nextPlay.rank, 
            playerAgent.state.nextPlay.suit
        ];

        if (playerAgent.state.nextPlay.rank !== eight) {
            possibilities.push(eight);
        }

        console.log(`
    😔 You have no playable cards
    Press ENTER to draw cards until matching:
    ${possibilities.join(", ")}`);
        question("    ");
        console.log(`
    Cards drawn: ${handToString(drawn)}
    Card played: ${cardToString(played)}
    Press ENTER to continue
        `);
        question("    ");
    },
    onGameOver: () => {
        const state = playerAgent.state;

        if (!state.deck.length) {
            console.log("    The deck is out of cards!");
        }

        console.log("    GAME OVER...");

        if (state.playerHand.length < state.computerHand.length) {
            console.log("    Player is the winner!");

            return;
        }

        if (state.computerHand.length < state.playerHand.length) {
            console.log("    Computer is the winner!");

            return;
        }

        console.log("    It's a draw!");
    }
};
