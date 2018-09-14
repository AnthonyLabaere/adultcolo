import { Injectable } from "@angular/core";

@Injectable()
export class CommonService {

    public static ADULTCOLO_STORAGE_KEY_PREFIX = 'adultcolo-';

    public isEmpty(s: string): boolean {
        return s === undefined || s === null || s.trim() === '';
    }
}
