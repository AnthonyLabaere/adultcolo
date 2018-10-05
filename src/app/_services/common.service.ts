import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as _ from 'lodash';
import { Player, TurnType, TurnTypeParameters, ValueWithWeight } from "../entities";

@Injectable()
export class CommonService {

    public static ALPHABET_FIRSTNAME: string[];
    public static ALPHABET_CITY: string[];
    public static CARDS_COLOR: string[];
    public static FORBIDDEN_VERBS: string[];
    public static HEADS_OR_TAILS: string[];
    public static SINGERS: string[];
    public static SOUNDS: string[];
    public static SYNONYMES: string[];

    public static PLAYER_SUFFIX: string;
    public static PLAYER_NONE: string;
    public static PLAYER_PHONE_OWNER: string;
    public static PLAYER_YOUNGER: string;
    public static PLAYER_OLDER: string;
    public static PLAYER_BEARDEST: string;
    public static PLAYER_DESIGNED: string;
    public static PLAYER_FIRST: string;
    public static PLAYER_PHONE_HOLDER: string;
    public static PLAYER_HOUSE_OWNER: string;

    public static DRINK_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND: string;
    public static DRINK_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND: string;
    public static DRINK_SINGULAR_IMPERATIVE_COMMAND: string;
    public static DRINK_PLURAL_COMMAND: string;
    public static GIVE_OUT_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND: string;
    public static GIVE_OUT_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND: string;
    public static GIVE_OUT_SINGULAR_IMPERATIVE_COMMAND: string;
    public static GIVE_OUT_PLURAL_COMMAND: string;

    public static ONE_SIP_NUMBER: string;
    public static TWO_SIP_NUMBER: string;
    public static THREE_SIP_NUMBER: string;
    public static FOUR_SIP_NUMBER: string;
    public static FIVE_SIP_NUMBER: string;
    public static SIP_SUFFIX_SINGULAR: string;
    public static SIP_SUFFIX_PLURAL: string;

    public static DATA_FILE_PATH = '../assets/data/';

    public static DATA_PLAYER_KEY_TO_REPLACE = '<<player>>';
    public static DATA_SECOND_PLAYER_KEY_TO_REPLACE = '<<second-player>>';
 
    public static DATA_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND_KEY_TO_REPLACE = '<<singular-indicative-second-person-command>>';
    public static DATA_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND_KEY_TO_REPLACE = '<<singular-indicative-third-person-command>>';
    public static DATA_SINGULAR_IMPERATIVE_COMMAND_KEY_TO_REPLACE = '<<singular-imperative-command>>';
    public static DATA_PLURAL_COMMAND_KEY_TO_REPLACE = '<<plural-command>>';

    public static DATA_SIP_NUMBER_KEY_TO_REPLACE = '<<sipNumber>>';
    public static DATA_SIP_SUFFIX_KEY_TO_REPLACE = '<<sipSuffix>>';

    public static DATA_RANDOM_LETTER_FIRSTNAME_KEY_TO_REPLACE = '<<random-letter-firstname>>';
    public static DATA_RANDOM_LETTER_CITY_KEY_TO_REPLACE = '<<random-letter-city>>';
    public static DATA_RANDOM_CARD_COLOR_KEY_TO_REPLACE = '<<random-card-color>>';
    public static DATA_RANDOM_FORBIDDEN_VERBS_KEY_TO_REPLACE = '<<random-forbidden-verb>>';
    public static DATA_RANDOM_HEADS_OR_TAILS_VERBS_KEY_TO_REPLACE = '<<random-heads-or-tails>>';
    public static DATA_RANDOM_SINGER_KEY_TO_REPLACE = '<<random-singer>>';
    public static DATA_RANDOM_SOUND_KEY_TO_REPLACE = '<<random-sound>>';
    public static DATA_RANDOM_SYNONYME_KEY_TO_REPLACE = '<<random-synonyme>>';

    public static ADULTCOLO_STORAGE_KEY_PREFIX = 'adultcolo-';

    constructor(private translate: TranslateService) {
    }

    public initLocalizedConstants(): void {
        this.translate.get('common.alphabet.firstname').subscribe((str: string[]) => {CommonService.ALPHABET_FIRSTNAME = str});
        this.translate.get('common.alphabet.city').subscribe((str: string[]) => {CommonService.ALPHABET_CITY = str});
        this.translate.get('common.cards.color').subscribe((str: string[]) => {CommonService.CARDS_COLOR = str});
        this.translate.get('common.forbidden.verbs').subscribe((str: string[]) => {CommonService.FORBIDDEN_VERBS = str});
        this.translate.get('common.headsrTails').subscribe((str: string[]) => {CommonService.HEADS_OR_TAILS = str});
        this.translate.get('common.singers').subscribe((str: string[]) => {CommonService.SINGERS = str});
        this.translate.get('common.sounds').subscribe((str: string[]) => {CommonService.SOUNDS = str});
        this.translate.get('common.synonymes').subscribe((str: string[]) => {CommonService.SYNONYMES = str});

        this.translate.get('common.player.suffix').subscribe((str: string) => {CommonService.PLAYER_SUFFIX = str;});
        this.translate.get('common.player.none').subscribe((str: string) => {CommonService.PLAYER_NONE = str;});
        this.translate.get('common.player.phoneOwner').subscribe((str: string) => {CommonService.PLAYER_PHONE_OWNER = str;});
        this.translate.get('common.player.younger').subscribe((str: string) => {CommonService.PLAYER_YOUNGER = str;});
        this.translate.get('common.player.older').subscribe((str: string) => {CommonService.PLAYER_OLDER = str;});
        this.translate.get('common.player.beardest').subscribe((str: string) => {CommonService.PLAYER_BEARDEST = str;});
        this.translate.get('common.player.designed').subscribe((str: string) => {CommonService.PLAYER_DESIGNED = str;});
        this.translate.get('common.player.first').subscribe((str: string) => {CommonService.PLAYER_FIRST = str;});
        this.translate.get('common.player.phoneHolder').subscribe((str: string) => {CommonService.PLAYER_PHONE_HOLDER = str;});
        this.translate.get('common.player.houseOwner').subscribe((str: string) => {CommonService.PLAYER_HOUSE_OWNER = str;});

        this.translate.get('common.command.drink.singular.indicative.second-person').subscribe((str: string) => {CommonService.DRINK_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND = str;});
        this.translate.get('common.command.drink.singular.indicative.third-person').subscribe((str: string) => {CommonService.DRINK_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND = str;});
        this.translate.get('common.command.drink.singular.imperative').subscribe((str: string) => {CommonService.DRINK_SINGULAR_IMPERATIVE_COMMAND = str;});
        this.translate.get('common.command.drink.plural').subscribe((str: string) => {CommonService.DRINK_PLURAL_COMMAND = str;});
        this.translate.get('common.command.give-out.singular.indicative.second-person').subscribe((str: string) => {CommonService.GIVE_OUT_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND = str;});
        this.translate.get('common.command.give-out.singular.indicative.third-person').subscribe((str: string) => {CommonService.GIVE_OUT_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND = str;});
        this.translate.get('common.command.give-out.singular.imperative').subscribe((str: string) => {CommonService.GIVE_OUT_SINGULAR_IMPERATIVE_COMMAND = str;});
        this.translate.get('common.command.give-out.plural').subscribe((str: string) => {CommonService.GIVE_OUT_PLURAL_COMMAND = str;});

        this.translate.get('common.sip.number.one').subscribe((str: string) => {CommonService.ONE_SIP_NUMBER = str;});
        this.translate.get('common.sip.number.two').subscribe((str: string) => {CommonService.TWO_SIP_NUMBER = str;});
        this.translate.get('common.sip.number.three').subscribe((str: string) => {CommonService.THREE_SIP_NUMBER = str;});
        this.translate.get('common.sip.number.four').subscribe((str: string) => {CommonService.FOUR_SIP_NUMBER = str;});
        this.translate.get('common.sip.number.five').subscribe((str: string) => {CommonService.FIVE_SIP_NUMBER = str;});
        this.translate.get('common.sip.suffix.singular').subscribe((str: string) => {CommonService.SIP_SUFFIX_SINGULAR = str;});
        this.translate.get('common.sip.suffix.plural').subscribe((str: string) => {CommonService.SIP_SUFFIX_PLURAL = str;});
    }

    // Region fonctionnelle

    public static getRandomSipNumber(bigSip: boolean = false): string {
        let randomNumber;
        if (bigSip) {
            randomNumber = _.random(2, 4);
        } else {
            randomNumber = _.random(2);
        }

        if (randomNumber === 0) {
            return CommonService.ONE_SIP_NUMBER;
        } else if (randomNumber === 1) {
            return CommonService.TWO_SIP_NUMBER;
        } else if (randomNumber === 2) {
            return CommonService.THREE_SIP_NUMBER;
        } else if (randomNumber === 3) {
            return CommonService.FOUR_SIP_NUMBER;
        } else if (randomNumber === 4) {
            return CommonService.FIVE_SIP_NUMBER;
        }
    }

    public static getPlayerLabel(turnType: TurnType, player?: Player): string {
        let playerLabel: string;

        if (player !== undefined) {
            // Le joueur est renseigné donc son nom est pris comme libellé de joueur
            playerLabel = player.name;
            if (turnType === TurnType.CONDITION) {
                playerLabel +=  CommonService.PLAYER_SUFFIX;
            }
        } else {
            // Pas de joueur renseigné
            if (turnType === TurnType.CONDITION) {
                // Si condition: pas de libellé
                playerLabel = CommonService.PLAYER_NONE;
            } else {
                // Sinon : construction d'un tableau de libellé possible avec un poids attribué à chaque libellé
                const labels: ValueWithWeight<string>[] = [
                    new ValueWithWeight<string>(CommonService.PLAYER_PHONE_OWNER, 1),
                    new ValueWithWeight<string>(CommonService.PLAYER_YOUNGER, 1),
                    new ValueWithWeight<string>(CommonService.PLAYER_OLDER, 1),
                    new ValueWithWeight<string>(CommonService.PLAYER_BEARDEST, 1),
                    new ValueWithWeight<string>(CommonService.PLAYER_DESIGNED, 4),
                    new ValueWithWeight<string>(CommonService.PLAYER_FIRST, 4),
                    new ValueWithWeight<string>(CommonService.PLAYER_PHONE_HOLDER, 2),
                    new ValueWithWeight<string>(CommonService.PLAYER_HOUSE_OWNER, 1)
                ];

                return CommonService.getValueFromShuffledArrayWithWeight(labels);
            }
        }


        return playerLabel;
    }

    public static replaceLabelsParameters(labels: string[], drink:boolean, sipNumber: string, sipSuffix:string, playerLabel:string, secondPlayerLabel:string) {
        const randomLetterFirstname = _.shuffle(CommonService.ALPHABET_FIRSTNAME)[0];
        const randomLetterCity = _.shuffle(CommonService.ALPHABET_CITY)[0];
        const randomCardColor = _.shuffle(CommonService.CARDS_COLOR)[0];
        const randomForbiddenVerb = _.shuffle(CommonService.FORBIDDEN_VERBS)[0];
        const randomHeadsOrTailsVerb = _.shuffle(CommonService.HEADS_OR_TAILS)[0];
        const randomSinger = _.shuffle(CommonService.SINGERS)[0];
        const randomSound = _.shuffle(CommonService.SOUNDS)[0];
        const randomSynonyme = _.shuffle(CommonService.SYNONYMES)[0];

        return labels.map(label => {
            return label
            .replace(CommonService.DATA_PLAYER_KEY_TO_REPLACE, playerLabel)
            .replace(CommonService.DATA_SECOND_PLAYER_KEY_TO_REPLACE, secondPlayerLabel)
            .replace(CommonService.getRegexFromKey(CommonService.DATA_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND_KEY_TO_REPLACE, true), CommonService.capitalize(drink ? CommonService.DRINK_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND : CommonService.GIVE_OUT_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND))
            .replace(CommonService.getRegexFromKey(CommonService.DATA_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND_KEY_TO_REPLACE), drink ? CommonService.DRINK_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND : CommonService.GIVE_OUT_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND)
            .replace(CommonService.getRegexFromKey(CommonService.DATA_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND_KEY_TO_REPLACE, true), CommonService.capitalize(drink ? CommonService.DRINK_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND : CommonService.GIVE_OUT_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND))
            .replace(CommonService.getRegexFromKey(CommonService.DATA_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND_KEY_TO_REPLACE), drink ? CommonService.DRINK_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND : CommonService.GIVE_OUT_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND)
            .replace(CommonService.getRegexFromKey(CommonService.DATA_SINGULAR_IMPERATIVE_COMMAND_KEY_TO_REPLACE, true), CommonService.capitalize(drink ? CommonService.DRINK_SINGULAR_IMPERATIVE_COMMAND : CommonService.GIVE_OUT_SINGULAR_IMPERATIVE_COMMAND))
            .replace(CommonService.getRegexFromKey(CommonService.DATA_SINGULAR_IMPERATIVE_COMMAND_KEY_TO_REPLACE), drink ? CommonService.DRINK_SINGULAR_IMPERATIVE_COMMAND : CommonService.GIVE_OUT_SINGULAR_IMPERATIVE_COMMAND)
            .replace(CommonService.getRegexFromKey(CommonService.DATA_PLURAL_COMMAND_KEY_TO_REPLACE, true), CommonService.capitalize(drink ? CommonService.DRINK_PLURAL_COMMAND : CommonService.GIVE_OUT_PLURAL_COMMAND))
            .replace(CommonService.getRegexFromKey(CommonService.DATA_PLURAL_COMMAND_KEY_TO_REPLACE), drink ? CommonService.DRINK_PLURAL_COMMAND : CommonService.GIVE_OUT_PLURAL_COMMAND)
            .replace(CommonService.DATA_SIP_NUMBER_KEY_TO_REPLACE, sipNumber)
            .replace(CommonService.DATA_SIP_SUFFIX_KEY_TO_REPLACE, sipSuffix)
            .replace(CommonService.DATA_RANDOM_LETTER_FIRSTNAME_KEY_TO_REPLACE, randomLetterFirstname.toUpperCase())
            .replace(CommonService.DATA_RANDOM_LETTER_CITY_KEY_TO_REPLACE, randomLetterCity.toUpperCase())
            .replace(CommonService.DATA_RANDOM_CARD_COLOR_KEY_TO_REPLACE, randomCardColor)
            .replace(CommonService.DATA_RANDOM_FORBIDDEN_VERBS_KEY_TO_REPLACE, randomForbiddenVerb)
            .replace(CommonService.DATA_RANDOM_HEADS_OR_TAILS_VERBS_KEY_TO_REPLACE, randomHeadsOrTailsVerb)
            .replace(CommonService.DATA_RANDOM_SINGER_KEY_TO_REPLACE, randomSinger)
            .replace(CommonService.DATA_RANDOM_SOUND_KEY_TO_REPLACE, randomSound)
            .replace(CommonService.DATA_RANDOM_SYNONYME_KEY_TO_REPLACE, randomSynonyme);
        });
    }

    public static showTitle(turnType: TurnType): boolean {
        return (<TurnTypeParameters> TurnTypeParameters.TURN_TYPE_PARAMETERS[turnType]).withTitle;
    }

    public static showDescription(turnType: TurnType): boolean {
        return (<TurnTypeParameters> TurnTypeParameters.TURN_TYPE_PARAMETERS[turnType]).withDescription;
    }

    public static showTimer(turnType: TurnType): boolean {
        return (<TurnTypeParameters> TurnTypeParameters.TURN_TYPE_PARAMETERS[turnType]).withTimer;
    }

    // endRegion

    // region Utilitaires

    public static getValueFromShuffledArrayWithWeight<T>(arrayWithWeight: ValueWithWeight<T>[]): T {
        const array: T[] = [];
        arrayWithWeight.forEach((element: ValueWithWeight<T>) => {
            for (let i = 0; i < element.weight; i++) {
                array.push(element.value);
            }
        });
        return _.shuffle(array)[0];
    }

    public static getRegexFromKey(key: string, atFirst?: boolean) {
        return new RegExp((atFirst ? "^" : "") + key);
    }
    
    public static isEmpty(s: string): boolean {
        return s === undefined || s === null || s.trim() === '';
    }

    public static random(): boolean {
        return _.random(1) === 1 ? true : false;
    }

    public static capitalize(s: string): string {
        return s.charAt(0).toUpperCase() + s.substr(1);;
    }

    // endRegion
}
