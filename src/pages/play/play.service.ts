import { Injectable } from "@angular/core";
import * as _ from 'lodash';
import { Condition, ForOrAgainst, Game, Instead, List, LongWinded, Song, Turn, TurnEntry, TurnType } from "../../app/entities";
import { PlayerService } from "../../app/_services/player.service";
import { TurnEntryService } from "../../app/_services/turnEntry.service";

@Injectable()
export class PlayService {

    // TODO : à mettre dans des paramètres
    private static TURN_NUMBER_TOTAL = 40;

    private static FOR_OR_AGAINSTS_BY_PLAY:number[] = [1, 3]; // Entre 1 et 3
    private static GAMES_BY_PLAY:number[] = [2, 4]; // Entre 2 et 4
    private static INSTEADS_BY_PLAY:number[] = [1, 3]; // Entre 1 et 3
    private static LISTS_BY_PLAY:number[] = [1, 3]; // Entre 1 et 3
    private static LONG_WINDEDS_BY_PLAY:number[] = [2, 4]; // Entre 2 et 4
    private static SONGS_BY_PLAY:number[] = [2, 3]; // Entre 2 et 3

    private static MIN_TURNS_AFTER_LONG_WINDED_END = 5;
    private static MAX_PERCENT_TURNS_BEFORE_ANY_LONG_WINDED_TURN = 0.75;

    constructor(private playerService: PlayerService, private turnEntryService: TurnEntryService) {
        
    }

    public getTurns(): Promise<Turn[]> {
        let turns: Turn[] = [];
        let longWindedTurns: Turn[][];

        return this.turnEntryService.getTurnEntries(TurnType.FOR_OR_AGAINST)
            .then((forOrAgainsts: ForOrAgainst[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.FOR_OR_AGAINST, forOrAgainsts, 
                    _.random(PlayService.FOR_OR_AGAINSTS_BY_PLAY[0], PlayService.FOR_OR_AGAINSTS_BY_PLAY[1])));

                return this.turnEntryService.getTurnEntries(TurnType.GAME);
            })
            .then((games: Game[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.GAME, games,
                    _.random(PlayService.GAMES_BY_PLAY[0], PlayService.GAMES_BY_PLAY[1])));

                return this.turnEntryService.getTurnEntries(TurnType.INSTEAD);
            })
            .then((insteads: Instead[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.INSTEAD, insteads, 
                    _.random(PlayService.INSTEADS_BY_PLAY[0], PlayService.INSTEADS_BY_PLAY[1])));

                return this.turnEntryService.getTurnEntries(TurnType.LIST);
            })
            .then((lists: List[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.LIST, lists, 
                    _.random(PlayService.LISTS_BY_PLAY[0], PlayService.LISTS_BY_PLAY[1])));

                return this.turnEntryService.getTurnEntries(TurnType.LONG_WINDED);
            })
            .then((longWindeds: LongWinded[]) => {
                longWindedTurns = this.getDecoupledTurnsFormTurnEntries(TurnType.LONG_WINDED, longWindeds, 
                    _.random(PlayService.LONG_WINDEDS_BY_PLAY[0], PlayService.LONG_WINDEDS_BY_PLAY[1]));

                return this.turnEntryService.getTurnEntries(TurnType.SONG);
            })
            .then((songs: Song[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.SONG, songs, 
                    _.random(PlayService.SONGS_BY_PLAY[0], PlayService.SONGS_BY_PLAY[1])));
 
                return this.turnEntryService.getTurnEntries(TurnType.CONDITION);
            })
            .then((conditions: Condition[]) => {
                // Complétion jusqu'à "TURN_NUMBER_TOTAL" avec des conditions
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.CONDITION, conditions, 
                    PlayService.TURN_NUMBER_TOTAL - (turns.length + longWindedTurns.length)));
                
                return Promise.resolve(_.shuffle(turns));
            })
            .then((turns: Turn[]) => {
                // Insertion des tours de longue haleine dans le tableau des tours
                let turnsIndex: number = 0; 
                let longWindedTurnsIndex: number = 0;
                const longWindedTurnsLength: number = longWindedTurns.length;

                // Tant que tous les tours de longue haleine n'ont pas été insérés
                while (longWindedTurnsIndex < longWindedTurnsLength) {
                    // Les tours de jeu de longue haleine doivent être tous atteint avant d'avoir effectué un certain pourcentage de tours
                    const random:number = _.random(Math.round((PlayService.MAX_PERCENT_TURNS_BEFORE_ANY_LONG_WINDED_TURN) * turns.length - (turnsIndex + 1)));
                    if (random <= 0) {
                        // Insertion de la première slide d'un tour de longue haleine
                        turns.splice(turnsIndex, 0, longWindedTurns[longWindedTurnsIndex][0]);

                        // Insertion de la deuxième slide d'un tour de longue haleine
                        const longWindedEndTurnIndex = turnsIndex + _.random(PlayService.MIN_TURNS_AFTER_LONG_WINDED_END, turns.length - (turnsIndex + 1));
                        turns.splice(longWindedEndTurnIndex, 0, longWindedTurns[longWindedTurnsIndex][1]);

                        // On avance dans le tableau des tours de longue haleine
                        longWindedTurnsIndex++;
                    }

                    // On avance dans le tableau des tours
                    turnsIndex++;
                }

                return Promise.resolve(turns);
            });
    }

    private getTurnFormTurnEntries(turnType: TurnType, turnEntries: TurnEntry[], numberToAdd: number): Turn[] {
        const turns: Turn[] = [];

        _.shuffle(turnEntries).slice(0, numberToAdd).forEach((turnEntry: TurnEntry) => {
            if (this.playerService.hasEnoughtPlayers()) {
                turns.push(Turn.constructFromTurnEntry(turnEntry, turnType, _.shuffle(this.playerService.getPlayers())[0]));
            } else {
                turns.push(Turn.constructFromTurnEntry(turnEntry, turnType));
            }
        });

        return turns;
    }

    private getDecoupledTurnsFormTurnEntries(turnType: TurnType, turnEntries: TurnEntry[], numberToAdd: number): Turn[][] {
        const turns: Turn[][] = [];

        _.shuffle(turnEntries).slice(0, numberToAdd).forEach((turnEntry: TurnEntry) => {
            if (this.playerService.hasEnoughtPlayers()) {
                turns.push(Turn.constructDecoupledFromTurnEntry(turnEntry, turnType, _.shuffle(this.playerService.getPlayers())[0]));
            } else {
                turns.push(Turn.constructDecoupledFromTurnEntry(turnEntry, turnType));
            }
        });

        return turns;
    }

}
