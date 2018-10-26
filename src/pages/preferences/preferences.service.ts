import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { TurnType } from "../../app/entities";
import { TurnTypeService } from "../../app/_services/turnType.service";
import { environment as ENV } from '../../environments/environment';

/**
 * Service des préférences
 */
@Injectable()
export class PreferenceService {

    constructor(private storage: Storage, private turnTypeService: TurnTypeService) {
    }

    /**
     * Récupère l'identifiant de stockage dans le cache d'une valeur de préférence
     * 
     * @param code le code de la valeur de préférence
     * 
     * @return l'identifiant de stockage dans le cache d'un joueur
     */
    private getPreferenceStorageKey(code: string): string {
        return ENV.PREFERENCE_STORAGE_KEY_PREFIX + code;
    }

    /**
     * Récupère la valeur de la préférence du type de tour
     * 
     * @param turnType le type de tour
     * 
     * @return la valeur de la préférence du type de tour
     */
    public getPreferenceValue(turnType: TurnType): Promise<boolean> {
        return this.storage.get(this.getPreferenceStorageKey(turnType))
            .then((preferenceValue: boolean) => {
                if (preferenceValue === null) {
                    return Promise.resolve(this.turnTypeService.getDefaultPreference(turnType));
                } else {
                    return Promise.resolve(preferenceValue);
                }
            });
    }

    /**
     * Met à jour la valeur de préférence du type de tour
     * 
     * @param turnType le type de tour
     * @param value la valeur
     */
    public setPreferenceValue(turnType: TurnType, value: boolean): Promise<void> {
        return this.storage.set(this.getPreferenceStorageKey(turnType), value)
            .then(() => {});
    }

}
