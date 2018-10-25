import { Injectable } from "@angular/core";
import * as _ from 'lodash';
import { TurnType, TurnTypeParameters, ValueWithWeight } from "../entities";
import { environment as ENV } from '../../environments/environment';
import { TurnTypeService } from "./turnType.service";

/**
 * Service englobant des méthodes communes
 */
@Injectable()
export class CommonService {

    public static DATA_FILE_PATH = '../assets/data/';

    constructor(private turnTypeService: TurnTypeService) {
    }

    // Region fonctionnelle

    /**
     * Génération d'un nombre de gorgées
     * 
     * @param bigSip Indique si un grand nombre de gorgées doit être retournés
     * 
     * @return le nombre de gorgées 
     */
    public static getRandomSipNumber(bigSip: boolean = false): number {
        let randomNumber;
        if (bigSip) {
            randomNumber = _.random(ENV.BIG_SIP_NUMBER[0], ENV.BIG_SIP_NUMBER[1]);
        } else {
            randomNumber = _.random(ENV.SIP_NUMBER[0], ENV.SIP_NUMBER[1]);
        }
        return randomNumber;
    }

    /**
     * Indique si un titre général doit être affiché pour un type de tour donné
     * 
     * @param turnType le type de tour
     * 
     * @return un booléen indiquant si un titre général doit être affiché
     */
    public showTitle(turnType: TurnType): boolean {
        return (<TurnTypeParameters> this.turnTypeService.getTurnTypeParameters(turnType)).withTitle;
    }

    /**
     * Indique si une description générale doit être affichée pour un type de tour donné
     * 
     * @param turnType le type de tour
     * 
     * @return un booléen indiquant si une description générale doit être affichée
     */
    public showDescription(turnType: TurnType): boolean {
        return (<TurnTypeParameters> this.turnTypeService.getTurnTypeParameters(turnType)).withDescription;
    }

    /**
     * Indique si un timer doit être affiché pour un type de tour donné
     * 
     * @param turnType le type de tour
     * 
     * @return un booléen indiquant si un timer général doit être affiché
     */
    public showTimer(turnType: TurnType): boolean {
        return (<TurnTypeParameters> this.turnTypeService.getTurnTypeParameters(turnType)).withTimer;
    }

    // endRegion

    // region Utilitaires

    /**
     * Récupère un élément d'un tableau d'élement avec poids
     * 
     * @param arrayWithWeight le tableau d'élement avec poids
     * 
     * @return l'élément sélectionné
     */
    public static getValueFromShuffledArrayWithWeight<T>(arrayWithWeight: ValueWithWeight<T>[]): T {
        const array: T[] = [];
        arrayWithWeight.forEach((element: ValueWithWeight<T>) => {
            for (let i = 0; i < element.weight; i++) {
                array.push(element.value);
            }
        });
        return _.shuffle(array)[0];
    }

    /**
     * Construit une regex avec une chaîne de caractère donné
     * 
     * @param key la chaîne de caractère
     * @param atFirst un booléen indiquant si la chaîne de caractère doit être trouvé au début d'une autre
     * 
     * @return la regex correspondant à la chaîne de caractère donnée
     */
    public static getRegexFromKey(key: string, atFirst?: boolean) {
        return new RegExp((atFirst ? "^" : "") + key);
    }
    
    /**
     * Vérifie si une chaîne de caractère est vide
     * 
     * @param s la chaîne de caractère
     * 
     * @return un booléen indiquant si la chaîne de caractère est vide
     */
    public static isEmpty(s: string): boolean {
        return s === undefined || s === null || s.trim() === '';
    }

    /**
     * Génération d'un booléen aléatoire
     * 
     * @return un booléen aléatoire
     */
    public static random(): boolean {
        return _.random(1) === 1 ? true : false;
    }

    /**
     * Retourne une chaîne de caractère similaire à celle donnée en paramètre avec la première lettre en majuscule
     * 
     * @param s la chaîne de caractère à "capitaliser"
     * 
     * @return une chaîne de caractère similaire à celle donnée en paramètre avec la première lettre en majuscule
     */
    public static capitalize(s: string): string {
        return s.charAt(0).toUpperCase() + s.substr(1);;
    }

    // endRegion
}
