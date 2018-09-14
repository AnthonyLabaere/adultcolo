import { Injectable } from "@angular/core";
import * as _ from 'lodash';
import { Condition, Turn, TurnType } from "../../app/entities";
import { ConditionService } from "../../app/_services/condition.service";


@Injectable()
export class GameService {

    private static CONDITIONS_BY_GAME:number = 5;

    constructor(private conditionService: ConditionService) {

    }

    public getTurns(): Promise<Turn[]> {
        const turns: Turn[] = [];

        return this.conditionService.getConditions()
            .then((conditions: Condition[]) => {
                _.shuffle(conditions).slice(0, GameService.CONDITIONS_BY_GAME - 1).forEach((condition: Condition) => {
                    turns.push(new Turn(TurnType.Condition, condition.theme, condition.labels.general));
                });
                
                return Promise.resolve(turns);
            })
    }


}
