import { Injectable } from "@angular/core";
import { Condition } from "../../app/entities";
import { ConditionService } from "../../app/_services/condition.service";


@Injectable()
export class GameService {

    constructor(private conditionService: ConditionService) {

    }

    public getTurns(): Promise<string[]> {
        const turns: string[] = [];

        return this.conditionService.getConditions()
            .then((conditions: Condition[]) => {
                conditions.forEach((condition: Condition) => {
                    turns.push(condition.labels.general);
                });
                
                return Promise.resolve(turns);
            })
    }


}
