import { Injectable } from "@angular/core";
import * as _ from 'lodash';
import { Condition, ForOrAgainst, Turn, TurnType, Game } from "../../app/entities";
import { PlayerService } from "../../app/_services/player.service";
import { TurnEntryService } from "../../app/_services/turnEntry.service";


@Injectable()
export class PlayService {

    private static CONDITIONS_BY_PLAY:number = 1;
    private static FOR_OR_AGAINSTS_BY_PLAY:number = 1;
    private static GAMES_BY_PLAY:number = 1;

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

                return Promise.resolve(_.shuffle(turns));
            });
    }


}
