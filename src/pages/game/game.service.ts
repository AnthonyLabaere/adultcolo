import { Injectable } from "@angular/core";
import { Condition, Turn, TurnType } from "../../app/entities";
import { ConditionService } from "../../app/_services/condition.service";


@Injectable()
export class GameService {

    constructor(private conditionService: ConditionService) {

    }

    public getTurns(): Promise<Turn[]> {
        const turns: Turn[] = [];

        return this.conditionService.getConditions()
            .then((conditions: Condition[]) => {
                conditions.forEach((condition: Condition) => {
                    turns.push(new Turn(TurnType.Condition, condition.theme, condition.labels.general));
                });
                
                return Promise.resolve(turns);
            })
    }


}
