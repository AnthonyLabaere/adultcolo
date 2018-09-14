import { Injectable } from "@angular/core";
import * as _ from 'lodash';
import { Condition, Turn } from "../../app/entities";
import { ConditionService } from "../../app/_services/condition.service";
import { PlayerService } from "../../app/_services/player.service";


@Injectable()
export class GameService {

    private static CONDITIONS_BY_GAME:number = 5;

    constructor(private playerService: PlayerService, private conditionService: ConditionService) {
        
    }

    public getTurns(): Promise<Turn[]> {
        const turns: Turn[] = [];

        return this.conditionService.getConditions()
            .then((conditions: Condition[]) => {
                _.shuffle(conditions).slice(0, GameService.CONDITIONS_BY_GAME - 1).forEach((condition: Condition) => {
                    if (this.playerService.hasEnoughtPlayers()) {
                        turns.push(Turn.constructFromCondition(condition, _.shuffle(this.playerService.getPlayers())[0]));
                    } else {
                        turns.push(Turn.constructFromCondition(condition));
                    }
                });
                
                return Promise.resolve(turns);
            })
    }


}
