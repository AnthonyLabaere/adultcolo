import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as _ from 'lodash';
import { TurnType, Player, ValueWithWeight } from "../entities";

@Injectable()
export class CommonService {

    public static PLAYER_SUFFIX: string;
    public static PLAYER_NONE: string;
    public static PLAYER_PHONE_OWNER: string;
    public static PLAYER_YOUNGER: string;
    public static PLAYER_OLDER: string;
    public static PLAYER_BEARDEST: string;
    public static PLAYER_DESIGNED: string;
    public static PLAYER_FIRST: string;
    public static PLAYER_PHONE_HOLDER: string;

    public static DRINK_SINGULAR_COMMAND: string;
    public static DRINK_PLURAL_COMMAND: string;
    public static GIVE_OUT_SINGULAR_COMMAND: string;
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
    public static DATA_SINGULAR_COMMAND_KEY_TO_REPLACE = '<<singular-command>>';
    public static DATA_SINGULAR_COMMAND_AT_START_REGEX_TO_REPLACE = /^<<singular-command>>/;
    public static DATA_SINGULAR_COMMAND_REGEX_TO_REPLACE = /<<singular-command>>/;
    public static DATA_PLURAL_COMMAND_KEY_TO_REPLACE = '<<plural-command>>';
    public static DATA_PLURAL_COMMAND_AT_START_REGEX_TO_REPLACE = /^<<plural-command>>/;
    public static DATA_PLURAL_COMMAND_REGEX_TO_REPLACE = /<<plural-command>>/;
    public static DATA_SIP_NUMBER_KEY_TO_REPLACE = '<<sipNumber>>';
    public static DATA_SIP_SUFFIX_KEY_TO_REPLACE = '<<sipSuffix>>';

    public static ADULTCOLO_STORAGE_KEY_PREFIX = 'adultcolo-';

    constructor(private translate: TranslateService) {
    }

    public initLocalizedConstants(): void {
        this.translate.get('common.player.suffix').subscribe((playerSuffix: string) => {CommonService.PLAYER_SUFFIX = playerSuffix;});
        this.translate.get('common.player.none').subscribe((playerNone: string) => {CommonService.PLAYER_NONE = playerNone;});
        this.translate.get('common.player.phoneOwner').subscribe((playerPhoneOwner: string) => {CommonService.PLAYER_PHONE_OWNER = playerPhoneOwner;});
        this.translate.get('common.player.younger').subscribe((playerYounger: string) => {CommonService.PLAYER_YOUNGER = playerYounger;});
        this.translate.get('common.player.older').subscribe((playerOlder: string) => {CommonService.PLAYER_OLDER = playerOlder;});
        this.translate.get('common.player.beardest').subscribe((playerBeardest: string) => {CommonService.PLAYER_BEARDEST = playerBeardest;});
        this.translate.get('common.player.designed').subscribe((playerDesigned: string) => {CommonService.PLAYER_DESIGNED = playerDesigned;});
        this.translate.get('common.player.first').subscribe((playerFirst: string) => {CommonService.PLAYER_FIRST = playerFirst;});
        this.translate.get('common.player.phoneHolder').subscribe((playerPhoneHolder: string) => {CommonService.PLAYER_PHONE_HOLDER = playerPhoneHolder;});

        this.translate.get('common.command.drink.singular').subscribe((drinkSingularCommand: string) => {CommonService.DRINK_SINGULAR_COMMAND = drinkSingularCommand;});
        this.translate.get('common.command.drink.plural').subscribe((drinkPluralCommand: string) => {CommonService.DRINK_PLURAL_COMMAND = drinkPluralCommand;});
        this.translate.get('common.command.give-out.singular').subscribe((giveOutSingularCommand: string) => {CommonService.GIVE_OUT_SINGULAR_COMMAND = giveOutSingularCommand;});
        this.translate.get('common.command.give-out.plural').subscribe((giveOutPluralCommand: string) => {CommonService.GIVE_OUT_PLURAL_COMMAND = giveOutPluralCommand;});

        this.translate.get('common.sip.number.one').subscribe((oneSipNumber: string) => {CommonService.ONE_SIP_NUMBER = oneSipNumber;});
        this.translate.get('common.sip.number.two').subscribe((twoSipNumber: string) => {CommonService.TWO_SIP_NUMBER = twoSipNumber;});
        this.translate.get('common.sip.number.three').subscribe((threeSipNumber: string) => {CommonService.THREE_SIP_NUMBER = threeSipNumber;});
        this.translate.get('common.sip.number.four').subscribe((fourSipNumber: string) => {CommonService.FOUR_SIP_NUMBER = fourSipNumber;});
        this.translate.get('common.sip.number.five').subscribe((fiveSipNumber: string) => {CommonService.FIVE_SIP_NUMBER = fiveSipNumber;});
        this.translate.get('common.sip.suffix.singular').subscribe((sipSuffixSingular: string) => {CommonService.SIP_SUFFIX_SINGULAR = sipSuffixSingular;});
        this.translate.get('common.sip.suffix.plural').subscribe((sipSuffixPlural: string) => {CommonService.SIP_SUFFIX_PLURAL = sipSuffixPlural;});
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
                // TODO : tableau à externaliser ?
                const labels: ValueWithWeight<string>[] = [
                    new ValueWithWeight<string>(CommonService.PLAYER_PHONE_OWNER, 1),
                    new ValueWithWeight<string>(CommonService.PLAYER_YOUNGER, 1),
                    new ValueWithWeight<string>(CommonService.PLAYER_OLDER, 1),
                    new ValueWithWeight<string>(CommonService.PLAYER_BEARDEST, 1),
                    new ValueWithWeight<string>(CommonService.PLAYER_DESIGNED, 4),
                    new ValueWithWeight<string>(CommonService.PLAYER_FIRST, 4),
                    new ValueWithWeight<string>(CommonService.PLAYER_PHONE_HOLDER, 2)
                ];

                return CommonService.getValueFromShuffledArrayWithWeight(labels);
            }
        }


        return playerLabel;
    }

    public static replaceLabelsParameters(labels: string[], singularCommand:string, pluralCommand:string, sipNumber: string, sipSuffix:string, playerLabel:string) {
        return labels.map(label => {
            return label
            .replace(CommonService.DATA_PLAYER_KEY_TO_REPLACE, playerLabel)
            .replace(CommonService.DATA_SINGULAR_COMMAND_AT_START_REGEX_TO_REPLACE, CommonService.capitalize(singularCommand))
            .replace(CommonService.DATA_SINGULAR_COMMAND_REGEX_TO_REPLACE, singularCommand)
            .replace(CommonService.DATA_PLURAL_COMMAND_AT_START_REGEX_TO_REPLACE, CommonService.capitalize(pluralCommand))
            .replace(CommonService.DATA_PLURAL_COMMAND_REGEX_TO_REPLACE, pluralCommand)
            .replace(CommonService.DATA_SIP_NUMBER_KEY_TO_REPLACE, sipNumber)
            .replace(CommonService.DATA_SIP_SUFFIX_KEY_TO_REPLACE, sipSuffix);
        });
    }
    
    // Un seul object pour réprensenter toutes les propriétés ? Et en ajoutant le nombre d'éléments à insérer dans un jeu
    private static SHOW_TITLE_MAP: any;
    
    private static getShowTitleMap(): any {
      if (CommonService.SHOW_TITLE_MAP === undefined) {
        CommonService.SHOW_TITLE_MAP = {};
  
        CommonService.SHOW_TITLE_MAP[TurnType.CONDITION] = false;
        CommonService.SHOW_TITLE_MAP[TurnType.FOR_OR_AGAINST] = true;
        CommonService.SHOW_TITLE_MAP[TurnType.GAME] = true;
        CommonService.SHOW_TITLE_MAP[TurnType.INSTEAD] = true;
        CommonService.SHOW_TITLE_MAP[TurnType.LIST] = true;
        CommonService.SHOW_TITLE_MAP[TurnType.LONG_WINDED] = false;
        CommonService.SHOW_TITLE_MAP[TurnType.SONG] = true;
      }
      
      return CommonService.SHOW_TITLE_MAP;
    }

    public static showTitle(turnType: TurnType): boolean {
        return CommonService.getShowTitleMap()[turnType];
    }
    
    private static SHOW_DESCRIPTION_MAP: any;
    
    private static getShowDescriptionMap(): any {
      if (CommonService.SHOW_DESCRIPTION_MAP === undefined) {
        CommonService.SHOW_DESCRIPTION_MAP = {};
  
        CommonService.SHOW_DESCRIPTION_MAP[TurnType.CONDITION] = false;
        CommonService.SHOW_DESCRIPTION_MAP[TurnType.FOR_OR_AGAINST] = true;
        CommonService.SHOW_DESCRIPTION_MAP[TurnType.GAME] = false;
        CommonService.SHOW_DESCRIPTION_MAP[TurnType.INSTEAD] = true;
        CommonService.SHOW_DESCRIPTION_MAP[TurnType.LIST] = true;
        CommonService.SHOW_DESCRIPTION_MAP[TurnType.LONG_WINDED] = false;
        CommonService.SHOW_DESCRIPTION_MAP[TurnType.SONG] = true;
      }
      
      return CommonService.SHOW_DESCRIPTION_MAP;
    }

    public static showDescription(turnType: TurnType): boolean {
        return CommonService.getShowDescriptionMap()[turnType];
    }
    
    private static WITH_TIMER_MAP: any;
    
    private static getWithTimerMap(): any {
      if (CommonService.WITH_TIMER_MAP === undefined) {
        CommonService.WITH_TIMER_MAP = {};
  
        CommonService.WITH_TIMER_MAP[TurnType.CONDITION] = false;
        CommonService.WITH_TIMER_MAP[TurnType.FOR_OR_AGAINST] = false;
        CommonService.WITH_TIMER_MAP[TurnType.GAME] = false;
        CommonService.WITH_TIMER_MAP[TurnType.INSTEAD] = false;
        CommonService.WITH_TIMER_MAP[TurnType.LIST] = false;
        CommonService.WITH_TIMER_MAP[TurnType.SONG] = true;
      }
      
      return CommonService.WITH_TIMER_MAP;
    }

    public static withTimer(turnType: TurnType): boolean {
        return CommonService.getWithTimerMap()[turnType];
    }

    // endRegion

    //region Utilitaires

    public static getValueFromShuffledArrayWithWeight<T>(arrayWithWeight: ValueWithWeight<T>[]): T {
        const array: T[] = [];
        arrayWithWeight.forEach((element: ValueWithWeight<T>) => {
            for (let i = 0; i < element.weight; i++) {
                array.push(element.value);
            }
        });
        return _.shuffle(array)[0];
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
