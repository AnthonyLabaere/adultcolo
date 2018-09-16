import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as _ from 'lodash';

@Injectable()
export class CommonService {

    public static PLAYER_SUFFIX: string;

    public static DRINK_COMMAND: string;
    public static GIVE_OUT_COMMAND: string;

    public static ONE_SIP_NUMBER: string;
    public static TWO_SIP_NUMBER: string;
    public static THREE_SIP_NUMBER: string;
    public static FOUR_SIP_NUMBER: string;
    public static FIVE_SIP_NUMBER: string;
    public static SIP_SUFFIX_SINGULAR: string;
    public static SIP_SUFFIX_PLURAL: string;

    public static DATA_FILE_PATH = '../assets/data/';

    public static DATA_PLAYER_KEY_TO_REPLACE = '<<player>>';
    public static DATA_COMMAND_KEY_TO_REPLACE = '<<command>>';
    public static DATA_COMMAND_AT_START_REGEX_TO_REPLACE = /^<<command>>/;
    public static DATA_COMMAND_REGEX_TO_REPLACE = /<<command>>/;
    public static DATA_SIP_NUMBER_KEY_TO_REPLACE = '<<sipNumber>>';
    public static DATA_SIP_SUFFIX_KEY_TO_REPLACE = '<<sipSuffix>>';

    public static ADULTCOLO_STORAGE_KEY_PREFIX = 'adultcolo-';

    constructor(private translate: TranslateService) {
    }

    public initLocalizedConstants(): void {
        this.translate.get('common.player.suffix').subscribe((playerSuffix: string) => {CommonService.PLAYER_SUFFIX = playerSuffix;});
        this.translate.get('common.command.drink').subscribe((drinkCommand: string) => {CommonService.DRINK_COMMAND = drinkCommand;});
        this.translate.get('common.command.give-out').subscribe((giveOutCommand: string) => {CommonService.GIVE_OUT_COMMAND = giveOutCommand;});
        this.translate.get('common.sip.number.one').subscribe((oneSipNumber: string) => {CommonService.ONE_SIP_NUMBER = oneSipNumber;});
        this.translate.get('common.sip.number.two').subscribe((twoSipNumber: string) => {CommonService.TWO_SIP_NUMBER = twoSipNumber;});
        this.translate.get('common.sip.number.three').subscribe((threeSipNumber: string) => {CommonService.THREE_SIP_NUMBER = threeSipNumber;});
        this.translate.get('common.sip.number.four').subscribe((fourSipNumber: string) => {CommonService.FOUR_SIP_NUMBER = fourSipNumber;});
        this.translate.get('common.sip.number.five').subscribe((fiveSipNumber: string) => {CommonService.FIVE_SIP_NUMBER = fiveSipNumber;});
        this.translate.get('common.sip.suffix.singular').subscribe((sipSuffixSingular: string) => {CommonService.SIP_SUFFIX_SINGULAR = sipSuffixSingular;});
        this.translate.get('common.sip.suffix.plural').subscribe((sipSuffixPlural: string) => {CommonService.SIP_SUFFIX_PLURAL = sipSuffixPlural;});
    }

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
    
    public static isEmpty(s: string): boolean {
        return s === undefined || s === null || s.trim() === '';
    }

    public static random(): boolean {
        return _.random(1) === 1 ? true : false;
    }

    public static capitalize(s: string): string {
        return s.charAt(0).toUpperCase() + s.substr(1);;
    }
}
