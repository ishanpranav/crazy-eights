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

function displayState(state) {
    let nextPlayString;

    if (state.nextPlay.rank === eight) {
        nextPlayString = state.nextPlay.suit;
    } else {
        nextPlayString = cardToString(state.nextPlay);
    }

    clear();
    console.log(`
                        CR🤪ZY 8's
    -----------------------------------------------
    Next suit/rank to play: ➡️  ${nextPlayString}  ⬅️
    -----------------------------------------------
    Top of discard pile: ${cardToString(topOfDiscardPile(state))}
    Number of cards left in deck:`, state.deck.length);
    console.log(`    -----------------------------------------------
    🤖✋ (computer hand): ${handToString(state.computerHand)}
    😊✋ (player hand): ${handToString(state.playerHand)}
    -----------------------------------------------
`);
}

/**
 * Implements the agent behavior for the player. This object handles all
 * user-interface features.
 * 
 * `onReady`: called at the beginning of the agent's turn.
 * `onPlay`: called when the agent has a matching card and must play.
 * `onChangeSuit`: called when the agent has played an eight and must choose its
 *                 suit.
 * `onDraw`: called after the agent has drawn.
 * `onBeforeWitness`: called before any other agent plays a turn.
 * `onWitness`: called after any other agent has played a turn.
 * `onGameOver`: called when the game is over.
 */
export const playerAgent = {
    onReady: (state) => {
        playerAgent.state = state;

        displayState(state);
        console.log("    😊 Player's turn...");
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

        console.log("    Player played", cardToString(matches[input - 1]));

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
    onBeforeWitness: () => {
        displayState(playerAgent.state);
    },
    onWitness: (drawn, played, changedSuit) => {
        console.log(`    
    🤖 Computers's turn...
    `);

        if (drawn) {
            console.log("    Computer had to draw", handToString(drawn));
        }

        console.log("    Computer played", cardToString(played));

        if (changedSuit) {
            console.log("    Computer changed the suit to", changedSuit);
        }

        console.log("    Press ENTER to continue");
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

        console.log("    It's a tie!");
    }
};
