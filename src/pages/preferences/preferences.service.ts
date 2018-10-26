import { Injectable } from "@angular/core";
import { TurnTypeService } from "../../app/_services/turnType.service";
import { TurnType } from "../../app/entities";

/**
 * Service des préférences
 */
@Injectable()
export class PreferenceService {

    constructor(private turnTypeService: TurnTypeService) {
    }

    public getPreference(turnType: TurnType): boolean {
        return this.turnTypeService.getDefaultPreference(turnType);
    }

}
