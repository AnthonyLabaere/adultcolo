import { Injectable } from "@angular/core";
import * as _ from 'lodash';
import { Condition, ForOrAgainst, Game, Instead, List, Song, Turn, TurnEntry, TurnType, LongWinded } from "../../app/entities";
import { PlayerService } from "../../app/_services/player.service";
import { TurnEntryService } from "../../app/_services/turnEntry.service";


@Injectable()
export class PlayService {

    // TODO : à mettre dans des paramètres
    private static CONDITIONS_BY_PLAY:number = 1;
    private static FOR_OR_AGAINSTS_BY_PLAY:number = 1;
    private static GAMES_BY_PLAY:number = 1;
    private static INSTEADS_BY_PLAY:number = 1;
    private static LISTS_BY_PLAY:number = 1;
    private static LONG_WINDEDS_BY_PLAY:number = 5;
    private static SONGS_BY_PLAY:number = 1;

    constructor(private playerService: PlayerService, private turnEntryService: TurnEntryService) {
        
    }

    public getTurns(): Promise<Turn[]> {
        let turns: Turn[] = [];

        return this.turnEntryService.getTurnEntries(TurnType.CONDITION)
            .then((conditions: Condition[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.CONDITION, conditions, PlayService.CONDITIONS_BY_PLAY));
                
                return this.turnEntryService.getTurnEntries(TurnType.FOR_OR_AGAINST);
            })
            .then((forOrAgainsts: ForOrAgainst[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.FOR_OR_AGAINST, forOrAgainsts, PlayService.FOR_OR_AGAINSTS_BY_PLAY));

                return this.turnEntryService.getTurnEntries(TurnType.GAME);
            })
            .then((games: Game[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.GAME, games, PlayService.GAMES_BY_PLAY));

                return this.turnEntryService.getTurnEntries(TurnType.INSTEAD);
            })
            .then((insteads: Instead[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.INSTEAD, insteads, PlayService.INSTEADS_BY_PLAY));

                return this.turnEntryService.getTurnEntries(TurnType.LIST);
            })
            .then((lists: List[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.LIST, lists, PlayService.LISTS_BY_PLAY));

                return this.turnEntryService.getTurnEntries(TurnType.SONG);
            })
            .then((songs: Song[]) => {
                turns = turns.concat(this.getTurnFormTurnEntries(TurnType.SONG, songs, PlayService.SONGS_BY_PLAY));

                return Promise.resolve(_.shuffle(turns));
            });
    }

    public getLongWindedTurns(): Promise<Turn[]> {
        let turnsLongWinded: Turn[] = [];

        return this.turnEntryService.getTurnEntries(TurnType.LONG_WINDED)
            .then((longWindeds: LongWinded[]) => {
                turnsLongWinded = this.getTurnFormTurnEntries(TurnType.LONG_WINDED, longWindeds, PlayService.LONG_WINDEDS_BY_PLAY);

                return Promise.resolve(_.shuffle(turnsLongWinded));
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

}
