// clever-agent.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import { eight, ranks, suits } from "../lib/cards.mjs";

function countProperty(state, factors, values, propertyName) {
    const result = {};

    for (const value of values) {
        result[value] = 0.0;
    }

    for (const card of state.deck) {
        result[card[propertyName]] += factors.longTermFactor;
    }

    for (const card of state.playerHand) {
        result[card[propertyName]] += factors.shortTermFactor;
    }

    return result;
}

/* eslint-disable no-unused-vars */

/**
 * Implements the card-counting agent behavior. This agent first attempts to
 * match the current card's suit, then chooses the most difficult rank for its
 * opponent to match. If there is no suit match, it chooses the most difficult
 * suit for its opponent to match. Otherwise, it must play an eight.
 * 
 * When choosing the new suit, it chooses the most difficult match for its
 * opoonent.
 * 
 * `longTermFactor`: determines the weight of future moves for decisionmaking
 * `shortTermFactor`: determines the weight of the immediate turn
 * `onReady`: called at the beginning of the agent's turn.
 * `onPlay`: called when the agent has a matching card and must play.
 * `onChangeSuit`: called when the agent has played an eight and must choose its
 *                 suit.
 */
export const cleverAgent = {
    factors: {
        longTermFactor: 1.0,
        shortTermFactor: 3.0
    },
    onReady: (state) => {
        cleverAgent.state = state;
    },
    onPlay: (matches) => {
        if (matches.length === 1) {
            return matches[0];
        }

        const suitMatches = [];
        const rankMatches = [];

        for (const match of matches) {
            if (match.rank === eight) {
                continue;
            }

            if (match.suit === cleverAgent.state.nextPlay.suit) {
                suitMatches.push(match);

                continue;
            }

            rankMatches.push(match);
        }

        if (suitMatches.length) {
            const rankCounts = countProperty(
                cleverAgent.state, 
                cleverAgent.factors, 
                ranks, 
                'rank');

            suitMatches.sort((left, right) => {
                return rankCounts[left.rank] - rankCounts[right.rank];
            });

            console.log(suitMatches);

            return suitMatches[0];
        }

        if (rankMatches.length) {
            const suitCounts = countProperty(
                cleverAgent.state,
                cleverAgent.factors,
                suits, 
                'suit');

            rankMatches.sort((left, right) => {
                return suitCounts[left.suit] - suitCounts[right.suit];
            });

            console.log(rankMatches);

            return rankMatches[0];
        }

        return matches[0];
    },
    onChangeSuit: () => {
        const suitCounts = countProperty(
            cleverAgent.state,
            cleverAgent.factors,
            suits, 
            'suit');
        let minSuit = suits[0];
        let minSuitCount = 0;

        for (const suit of suits) {
            if (suitCounts[suit] < minSuitCount) {
                minSuit = suit;
                minSuitCount = suitCounts[suit];
            }
        }

        return minSuit;
    },
    onDraw: (drawn, played) => { },
    onBeforeWitness: () => { },
    onWitness: (drawn, played, changedSuit) => { },
    onGameOver: () => { }
};

/* eslint-enable no-unused-vars */
