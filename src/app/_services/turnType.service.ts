import { Injectable } from "@angular/core";
import { environment as ENV } from '../../environments/environment';
import { TurnType, TurnTypeParameters } from "../entities";

/**
 * Service de gestion des types de tours
 */
@Injectable()
export class TurnTypeService {

    /** Tableau de la configuration des types de tours  */
    private turnTypeParameters:any;

    constructor() {
        this.turnTypeParameters = {
            [TurnType.AD]: TurnTypeParameters.buildFromArray(ENV.AD_PARAMETERS),
            [TurnType.CARTOON]: TurnTypeParameters.buildFromArray(ENV.CARTOON_PARAMETERS),
            [TurnType.CONDITION]: TurnTypeParameters.buildFromArray(ENV.CONDITION_PARAMETERS),
            [TurnType.FOR_OR_AGAINST]: TurnTypeParameters.buildFromArray(ENV.FOR_OR_AGAINST_PARAMETERS),
            [TurnType.GAME]: TurnTypeParameters.buildFromArray(ENV.GAME_PARAMETERS),
            [TurnType.GENERAL]: TurnTypeParameters.buildFromArray(ENV.GENERAL_PARAMETERS),
            [TurnType.INSTEAD]: TurnTypeParameters.buildFromArray(ENV.INSTEAD_PARAMETERS),
            [TurnType.LIST]: TurnTypeParameters.buildFromArray(ENV.LIST_PARAMETERS),
            [TurnType.LONG_WINDED]: TurnTypeParameters.buildFromArray(ENV.LONG_WINDED_PARAMETERS),
            [TurnType.MOVIE]: TurnTypeParameters.buildFromArray(ENV.MOVIE_PARAMETERS),
            [TurnType.SONG]: TurnTypeParameters.buildFromArray(ENV.SONG_PARAMETERS)
        };
    }

    /** 
     * Récupère la configuration d'un type de tour
     * 
     * @param turnType le type de tour
     * 
     * @return la configuration d'un type de tour
     */
    public getDefaultPreference(turnType: TurnType):boolean {
        return this.turnTypeParameters[turnType].preference;
    }

    /** 
     * Récupère la configuration d'un type de tour
     * 
     * @param turnType le type de tour
     * 
     * @return la configuration d'un type de tour
     */
    public getTurnTypeParameters(turnType: TurnType):TurnTypeParameters {
        return this.turnTypeParameters[turnType];
    }

    /**
     * Récupération des types de tours "question / réponse"
     * 
     * @return les types de tours "question / réponse"
     */
    public getQuestionTurnTypes(): TurnType[] {
        return Object.keys(TurnType).map(k => TurnType[k as any]).map(v => v as TurnType).filter(t => {
            return this.turnTypeParameters[t].isQuestion;
        });
    }
}
