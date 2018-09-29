import { Injectable } from "@angular/core";
import * as _ from 'lodash';
import { Condition, ForOrAgainst, Turn, TurnType, Game, Instead, Song, List } from "../../app/entities";
import { PlayerService } from "../../app/_services/player.service";
import { TurnEntryService } from "../../app/_services/turnEntry.service";


@Injectable()
export class PlayService {

    private static CONDITIONS_BY_PLAY:number = 1;
    private static FOR_OR_AGAINSTS_BY_PLAY:number = 1;
    private static GAMES_BY_PLAY:number = 1;
    private static INSTEADS_BY_PLAY:number = 1;
    private static LISTS_BY_PLAY:number = 1;
    private static SONGS_BY_PLAY:number = 1;

    constructor(private playerService: PlayerService, private turnEntryService: TurnEntryService) {
        
    }

    public getTurns(): Promise<Turn[]> {
        const turns: Turn[] = [];

        return this.turnEntryService.getTurnEntries(TurnType.CONDITION)
            .then((conditions: Condition[]) => {
                // Faire une méthode générique pour l'ajout de bidules
                _.shuffle(conditions).slice(0, PlayService.CONDITIONS_BY_PLAY).forEach((condition: Condition) => {
                    if (this.playerService.hasEnoughtPlayers()) {
                        turns.push(Turn.constructFromCondition(condition, _.shuffle(this.playerService.getPlayers())[0]));
                    } else {
                        turns.push(Turn.constructFromCondition(condition));
                    }
                });
                
                return this.turnEntryService.getTurnEntries(TurnType.FOR_OR_AGAINST);
            })
            .then((forOrAgainsts: ForOrAgainst[]) => {
                _.shuffle(forOrAgainsts).slice(0, PlayService.FOR_OR_AGAINSTS_BY_PLAY).forEach((forOrAgainst: ForOrAgainst) => {
                    turns.push(Turn.constructFromForOrAgainst(forOrAgainst));
                });

                return this.turnEntryService.getTurnEntries(TurnType.GAME);
            })
            .then((games: Game[]) => {
                _.shuffle(games).slice(0, PlayService.GAMES_BY_PLAY).forEach((game: Game) => {
                    if (this.playerService.hasEnoughtPlayers()) {
                        turns.push(Turn.constructFromGame(game, _.shuffle(this.playerService.getPlayers())[0]));
                    } else {
                        turns.push(Turn.constructFromGame(game));
                    }
                });

                return this.turnEntryService.getTurnEntries(TurnType.INSTEAD);
            })
            .then((insteads: Instead[]) => {
                _.shuffle(insteads).slice(0, PlayService.INSTEADS_BY_PLAY).forEach((instead: Instead) => {
                    turns.push(Turn.constructFromInstead(instead));
                });

                return this.turnEntryService.getTurnEntries(TurnType.LIST);
            })
            .then((lists: List[]) => {
                _.shuffle(lists).slice(0, PlayService.LISTS_BY_PLAY).forEach((list: List) => {
                    if (this.playerService.hasEnoughtPlayers()) {
                        turns.push(Turn.constructFromList(list, _.shuffle(this.playerService.getPlayers())[0]));
                    } else {
                        turns.push(Turn.constructFromList(list));
                    }
                });

                return this.turnEntryService.getTurnEntries(TurnType.SONG);
            })
            .then((songs: Song[]) => {
                _.shuffle(songs).slice(0, PlayService.SONGS_BY_PLAY).forEach((song: Song) => {
                    turns.push(Turn.constructFromSong(song));
                });

                return Promise.resolve(_.shuffle(turns));
            });
    }


}
