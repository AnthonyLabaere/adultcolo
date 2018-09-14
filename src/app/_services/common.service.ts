import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as _ from 'lodash';

@Injectable()
export class CommonService {

    public static ONE_SIP_NUMBER: string;
    public static TWO_SIP_NUMBER: string;
    public static THREE_SIP_NUMBER: string;
    public static FOUR_SIP_NUMBER: string;
    public static FIVE_SIP_NUMBER: string;

    public static DRINK_COMMAND: string;
    public static GIVE_OUT_COMMAND: string;

    public static DATA_FILE_PATH = '../assets/data/';

    public static DATA_PLAYER_KEY_TO_REPLACE = '<<player>>';
    public static DATA_COMMAND_KEY_TO_REPLACE = '<<command>>';
    public static DATA_SIP_NUMBER_KEY_TO_REPLACE = '<<sipNumber>>';

    public static ADULTCOLO_STORAGE_KEY_PREFIX = 'adultcolo-';

    public static isEmpty(s: string): boolean {
        return s === undefined || s === null || s.trim() === '';
    }

    public static random(): boolean {
        return _.random(1) === 1 ? true : false;
    }

    public static capitalize(s: string): string {
        return s.charAt(0).toUpperCase() + s.substr(1);;
    }

    public static getRandomSipNumber(): string {
        const randomNumber = _.random(2);

        if (randomNumber === 0) {
            return CommonService.ONE_SIP_NUMBER;
        } else if (randomNumber === 1) {
            return CommonService.TWO_SIP_NUMBER;
        } else if (randomNumber === 2) {
            return CommonService.THREE_SIP_NUMBER;
        }
    }
}
