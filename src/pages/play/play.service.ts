import { Injectable } from "@angular/core";
import * as _ from 'lodash';
import { Condition, ForOrAgainst, Game, Instead, List, LongWinded, Song, Turn, TurnEntry, TurnType, Movie, General } from "../../app/entities";
import { PlayerService } from "../../app/_services/player.service";
import { TurnEntryService } from "../../app/_services/turnEntry.service";
import { environment as ENV } from '../../environments/environment';

@Injectable()
export class PlayService {

    constructor(private playerService: PlayerService, private turnEntryService: TurnEntryService) {
    }

    public getTurns(): Promise<Turn[]> {
        let turns: Turn[] = [];
        let longWindedTurns: Turn[][];

        // TODO : une seule promesse avec un flatten au bout ?
        return this.turnEntryService.getTurnEntries(TurnType.FOR_OR_AGAINST)
            .then((forOrAgainsts: ForOrAgainst[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.FOR_OR_AGAINST, forOrAgainsts, 
                    _.random(ENV.FOR_OR_AGAINSTS_BY_PLAY[0], ENV.FOR_OR_AGAINSTS_BY_PLAY[1])));

                return this.turnEntryService.getTurnEntries(TurnType.GAME);
            })
            .then((games: Game[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.GAME, games,
                    _.random(ENV.GAMES_BY_PLAY[0], ENV.GAMES_BY_PLAY[1])));

                return this.turnEntryService.getTurnEntries(TurnType.GENERAL);
            })
            .then((generals: General[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.GENERAL, generals,
                    _.random(ENV.GENERALS_BY_PLAY[0], ENV.GENERALS_BY_PLAY[1])));

                return this.turnEntryService.getTurnEntries(TurnType.INSTEAD);
            })
            .then((insteads: Instead[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.INSTEAD, insteads, 
                    _.random(ENV.INSTEADS_BY_PLAY[0], ENV.INSTEADS_BY_PLAY[1])));

                return this.turnEntryService.getTurnEntries(TurnType.LIST);
            })
            .then((lists: List[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.LIST, lists, 
                    _.random(ENV.LISTS_BY_PLAY[0], ENV.LISTS_BY_PLAY[1])));

                return this.turnEntryService.getTurnEntries(TurnType.LONG_WINDED);
            })
            .then((longWindeds: LongWinded[]) => {
                longWindedTurns = this.getDecoupledTurnsFormTurnEntries(TurnType.LONG_WINDED, longWindeds, 
                    _.random(ENV.LONG_WINDEDS_BY_PLAY[0], ENV.LONG_WINDEDS_BY_PLAY[1]));

                return this.turnEntryService.getTurnEntries(TurnType.MOVIE);
            })
            .then((movies: Movie[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.MOVIE, movies, 
                    _.random(ENV.MOVIES_BY_PLAY[0], ENV.MOVIES_BY_PLAY[1])));

                    return this.turnEntryService.getTurnEntries(TurnType.SONG);
            })
            .then((songs: Song[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.SONG, songs, 
                    _.random(ENV.SONGS_BY_PLAY[0], ENV.SONGS_BY_PLAY[1])));
 
                return this.turnEntryService.getTurnEntries(TurnType.CONDITION);
            })
            .then((conditions: Condition[]) => {
                // Complétion jusqu'à "TURN_NUMBER_TOTAL" avec des conditions
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.CONDITION, conditions, 
                    Math.max(ENV.TURN_NUMBER_TOTAL - (turns.length + longWindedTurns.length), 0)));
                
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
                    const random:number = _.random(Math.round((ENV.MAX_PERCENT_TURNS_BEFORE_ANY_LONG_WINDED_TURN) * turns.length - (turnsIndex + 1)));
                    if (random <= 0) {
                        // Insertion de la première slide d'un tour de longue haleine
                        turns.splice(turnsIndex, 0, longWindedTurns[longWindedTurnsIndex][0]);

                        // Insertion de la deuxième slide d'un tour de longue haleine
                        const longWindedEndTurnIndex = turnsIndex + _.random(ENV.MIN_TURNS_AFTER_LONG_WINDED_END, turns.length - (turnsIndex + 1));
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
                const players = _.shuffle(this.playerService.getPlayers());

                turns.push(Turn.constructFromTurnEntry(turnEntry, turnType, players[0], players[1]));
            } else if (!turnEntry.mandatoryPlayers) {
                turns.push(Turn.constructFromTurnEntry(turnEntry, turnType));
            }
        });

        return turns;
    }

    private getDecoupledTurnsFormTurnEntries(turnType: TurnType, turnEntries: TurnEntry[], numberToAdd: number): Turn[][] {
        const turns: Turn[][] = [];

        _.shuffle(turnEntries).slice(0, numberToAdd).forEach((turnEntry: TurnEntry) => {
            if (this.playerService.hasEnoughtPlayers()) {
                const players = _.shuffle(this.playerService.getPlayers());

                turns.push(Turn.constructDecoupledFromTurnEntry(turnEntry, turnType, players[0], players[1]));
            } else {
                turns.push(Turn.constructDecoupledFromTurnEntry(turnEntry, turnType));
            }
        });

        return turns;
    }

}
