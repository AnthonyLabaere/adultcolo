import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as _ from 'lodash';

@Injectable()
export class CommonService {

    public static DRINK_COMMAND;
    public static GIVE_OUT_COMMAND;

    public static DATA_FILE_PATH = '../assets/data/';

    public static DATA_PLAYER_KEY_TO_REPLACE = '<<player>>';
    public static DATA_COMMAND_KEY_TO_REPLACE = '<<command>>';

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
}
