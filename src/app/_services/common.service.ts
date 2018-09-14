import { Injectable } from "@angular/core";

@Injectable()
export class CommonService {

    public static DATA_FILE_PATH = '../assets/data/';

    public static DATA_PLAYER_KEY_TO_REPLACE = '<<player>>';

    public static ADULTCOLO_STORAGE_KEY_PREFIX = 'adultcolo-';

    public static isEmpty(s: string): boolean {
        return s === undefined || s === null || s.trim() === '';
    }
}
