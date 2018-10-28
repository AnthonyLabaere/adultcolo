import { Injectable } from "@angular/core";
import * as _ from 'lodash';
import { Condition, ForOrAgainst, Game, General, Instead, List, LongWinded, Player, Turn, TurnEntry, TurnType, End } from "../../app/entities";
import { PlayerService } from "../../app/_services/player.service";
import { TurnEntryService } from "../../app/_services/turnEntry.service";
import { TurnTypeService } from "../../app/_services/turnType.service";
import { environment as ENV } from '../../environments/environment';
import { PreferenceService } from "../preferences/preferences.service";

/**
 * Service de construction d'une partie de jeu
 */
@Injectable()
export class PlayService {

    constructor(private playerService: PlayerService, private turnEntryService: TurnEntryService, private turnTypeService: TurnTypeService, 
        private preferenceService: PreferenceService) {
    }

    /**
     * Construit un tableau de tours correspondant à une partie de jeu
     * 
     * @return une promesse contenant les tours de jeu
     */
    public getTurns(): Promise<Turn[]> {
        // Initialisation de la map d'apparition des joueurs sur la partie
        let occurencePlayerMap: {player: Player, occurence: number}[];
        if (this.playerService.hasEnoughtPlayers()) {
            occurencePlayerMap = this.playerService.getPlayers().map((player: Player) => {
            return {
                player,
                occurence: 0
            };
          });
        }

        // Les tours classiques
        let turns: Turn[] = [];
        // Les tours dîts "De longue haleine" dont les slides sont décalés dans le temps
        let longWindedTurns: Turn[][];

        return this.getQuestionsTurns(occurencePlayerMap)
            .then((questionTurns: Turn[]) => {
                turns = turns.concat(questionTurns);

                return this.turnEntryService.getTurnEntries(TurnType.FOR_OR_AGAINST)
            })
            .then((forOrAgainsts: ForOrAgainst[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.FOR_OR_AGAINST, forOrAgainsts, 
                    _.random(ENV.FOR_OR_AGAINSTS_BY_PLAY[0], ENV.FOR_OR_AGAINSTS_BY_PLAY[1]), occurencePlayerMap));

                return this.turnEntryService.getTurnEntries(TurnType.GAME);
            })
            .then((games: Game[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.GAME, games,
                    _.random(ENV.GAMES_BY_PLAY[0], ENV.GAMES_BY_PLAY[1]), occurencePlayerMap));

                return this.turnEntryService.getTurnEntries(TurnType.GENERAL);
            })
            .then((generals: General[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.GENERAL, generals,
                    _.random(ENV.GENERALS_BY_PLAY[0], ENV.GENERALS_BY_PLAY[1]), occurencePlayerMap));

                return this.turnEntryService.getTurnEntries(TurnType.INSTEAD);
            })
            .then((insteads: Instead[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.INSTEAD, insteads, 
                    _.random(ENV.INSTEADS_BY_PLAY[0], ENV.INSTEADS_BY_PLAY[1]), occurencePlayerMap));

                return this.turnEntryService.getTurnEntries(TurnType.LIST);
            })
            .then((lists: List[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.LIST, lists, 
                    _.random(ENV.LISTS_BY_PLAY[0], ENV.LISTS_BY_PLAY[1]), occurencePlayerMap));

                return this.turnEntryService.getTurnEntries(TurnType.LONG_WINDED);
            })
            .then((longWindeds: LongWinded[]) => {
                longWindedTurns = this.getDecoupledTurnsFormTurnEntries(TurnType.LONG_WINDED, longWindeds, 
                    _.random(ENV.LONG_WINDEDS_BY_PLAY[0], ENV.LONG_WINDEDS_BY_PLAY[1]), occurencePlayerMap);

                return this.turnEntryService.getTurnEntries(TurnType.CONDITION);
            })
            .then((conditions: Condition[]) => {
                // Complétion jusqu'à "TURN_NUMBER_TOTAL" avec des conditions
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.CONDITION, conditions, 
                    Math.max(ENV.TURN_NUMBER_TOTAL - (turns.length + longWindedTurns.length), 0), occurencePlayerMap));
                
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

                return this.turnEntryService.getTurnEntries(TurnType.END);
            })
            .then((ends: End[]) => {
                // Insertion du tour de fin
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.END, ends, 1, occurencePlayerMap));

                return Promise.resolve(turns);
            });
    }

    /**
     * Construit le tableau des tours de questions
     * 
     * @return le tableau des tours de questions
     */
    private getQuestionsTurns(occurencePlayerMap: {player: Player, occurence: number}[]): Promise<Turn[]> {
        // Promesses de récupération des valeurs de préférences sur les types de tour de type questions
        const preferencePromises: Promise<{turnType: TurnType, value: boolean}>[] = this.turnTypeService.getQuestionTurnTypes().map(turnType => {
            return this.preferenceService.getPreferenceValue(turnType)
                .then((preferenceValue: boolean) => {
                    return Promise.resolve({
                        turnType,
                        value: preferenceValue
                    });
                });
        });

        return Promise.all(preferencePromises)
            .then((preferences: {turnType: TurnType, value: boolean}[]) => {
                // Récupération des types de tours de type question sélectionnés dans les préférences
                const turnTypes: TurnType[] = preferences.filter(preference => preference.value).map((preference) => {
                    return preference.turnType;
                });
                
                // Détermination du nombre de chaque type de tour
                const questionTurnsNumber: number = _.random(ENV.QUESTION_TURN_NUMBER_TOTAL_BY_PLAY[0], ENV.QUESTION_TURN_NUMBER_TOTAL_BY_PLAY[1]);

                const turnTypeDefaultNumber:number = Math.floor(questionTurnsNumber / turnTypes.length);
                const turnTypeNumbers: {turnType: TurnType, value: number}[] = turnTypes.map((turnType: TurnType) => {
                    return {
                        turnType,
                        value: turnTypeDefaultNumber
                    };
                });
                while (_.sumBy(turnTypeNumbers, 'value') < questionTurnsNumber) {
                    _.shuffle(turnTypeNumbers)[0].value++;
                }

                const turnPromises: Promise<Turn[]>[] = turnTypeNumbers.map(turnTypeNumber => {
                    return this.turnEntryService.getTurnEntries(turnTypeNumber.turnType)
                        .then((turnEntries: TurnEntry[]) => {
                            return Promise.resolve(this.getTurnFormTurnEntries(turnTypeNumber.turnType, turnEntries, turnTypeNumber.value, occurencePlayerMap));

                        });
                });

                return Promise.all(turnPromises)
                    .then((turnsArray: Turn[][]) => {
                        return Promise.resolve(_.shuffle(_.flatten(turnsArray)));
                    });
            });
    }

    /**
     * Construction de tours de jeu à partir de données retravaillées
     * 
     * @param turnType le type de tour
     * @param turnEntries les données retravaillées sur les types de tour
     * @param numberToAdd le nombre de tours à récupérer
     * 
     * @return les tours de jeu
     */
    private getTurnFormTurnEntries(turnType: TurnType, turnEntries: TurnEntry[], numberToAdd: number, occurencePlayerMap: {player: Player, occurence: number}[]): Turn[] {
        const turns: Turn[] = [];

        _.shuffle(turnEntries).slice(0, numberToAdd).forEach((turnEntry: TurnEntry) => {
            if (this.playerService.hasEnoughtPlayers()) {

                // Récupération des joueurs
                const players = this.playerService.getPlayerAndSecondPlayer(occurencePlayerMap);

                // Construction du tour
                const turn: Turn = Turn.constructFromTurnEntry(turnEntry, turnType, players[0], players[1]);

                // Mise à jour de l'occurence des joueurs concernés
                if (this.turnTypeService.hasPlayer(turnType) || turn.hasPlayer) {
                    _.find(occurencePlayerMap, ocm => {
                        return ocm.player.name === turn.player.name;
                    }).occurence++;
                }
                if (this.turnTypeService.hasSecondPlayer(turnType) || turn.hasSecondPlayer) {
                    _.find(occurencePlayerMap, ocm => {
                        return ocm.player.name === turn.secondPlayer.name;
                    }).occurence++;
                }

                // Ajout du tour
                turns.push(turn);
            } else if (!turnEntry.mandatoryPlayers) {
                turns.push(Turn.constructFromTurnEntry(turnEntry, turnType));
            }
        });

        return turns;
    }

    /**
     * Construction de tours de jeu découplés (= un tour par trio titre / libellé / description) à partir de données retravaillées
     * 
     * @param turnType le type de tour
     * @param turnEntries les données retravaillées sur les types de tour
     * @param numberToAdd le nombre de tours à récupérer
     * 
     * @return les tours de jeu découplés
     */
    private getDecoupledTurnsFormTurnEntries(turnType: TurnType, turnEntries: TurnEntry[], numberToAdd: number, occurencePlayerMap: {player: Player, occurence: number}[]): Turn[][] {
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
