import { Injectable } from "@angular/core";
import * as _ from 'lodash';
import { Condition, Turn, ForOrAgainst } from "../../app/entities";
import { ConditionService } from "../../app/_services/condition.service";
import { PlayerService } from "../../app/_services/player.service";
import { ForOrAgainstService } from "../../app/_services/forOrAgainst.service";


@Injectable()
export class PlayService {

    private static CONDITIONS_BY_PLAY:number = 10;
    private static FOR_OR_AGAINSTS_BY_PLAY:number = 5;

    constructor(private playerService: PlayerService, private conditionService: ConditionService, private forOrAgainstService: ForOrAgainstService) {
        
    }

    public getTurns(): Promise<Turn[]> {
        const turns: Turn[] = [];

        return this.conditionService.getConditions()
            .then((conditions: Condition[]) => {
                _.shuffle(conditions).slice(0, PlayService.CONDITIONS_BY_PLAY - 1).forEach((condition: Condition) => {
                    if (this.playerService.hasEnoughtPlayers()) {
                        turns.push(Turn.constructFromCondition(condition, _.shuffle(this.playerService.getPlayers())[0]));
                    } else {
                        turns.push(Turn.constructFromCondition(condition));
                    }
                });
                
                return this.forOrAgainstService.getForOrAgainsts();
            })
            .then((forOrAgainsts: ForOrAgainst[]) => {
                _.shuffle(forOrAgainsts).slice(0, PlayService.FOR_OR_AGAINSTS_BY_PLAY - 1).forEach((forOrAgainst: ForOrAgainst) => {
                    turns.push(Turn.constructFromForOrAgainst(forOrAgainst));
                });

                return Promise.resolve(_.shuffle(turns));
            });
    }


}
