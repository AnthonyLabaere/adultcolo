import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as _ from 'lodash';
import { ForOrAgainst, ForOrAgainstData, ThemeData } from "../entities";
import { CommonService } from "./common.service";
import { ThemeService } from "./theme.service";

//TODO : un seul service générique pour les TurnEntry ?
@Injectable()
export class ForOrAgainstService {

    private static FOR_OR_AGAINSTS_DATA_FILE_NAME = 'forOrAgainsts.json';

    private forOrAgainstsData: ForOrAgainstData[];
    private forOrAgainsts: ForOrAgainst[];

    constructor(private http: HttpClient, private translate: TranslateService, private themeService: ThemeService) {

    }

    private getForOrAgainstDataFilePath() {
        // TODO : vérifier que le fichier est bien rechargé après un changement de langue
        return CommonService.DATA_FILE_PATH + this.translate.getDefaultLang() + '/' + ForOrAgainstService.FOR_OR_AGAINSTS_DATA_FILE_NAME;;
    }

    public getForOrAgainsts(): Promise<ForOrAgainst[]> {
        if (this.forOrAgainsts) {
            return Promise.resolve(this.forOrAgainsts);
        } else {
            let themesData;
            return this.themeService.getThemesData()
                .then((themesDataTmp: ThemeData[]) => {
                    themesData = themesDataTmp;
                    return this.getForOrAgainstsData();
                })
                .then((forOrAgainstsData: ForOrAgainstData[]) => {
                    return Promise.resolve(this.buildForOrAgainsts(themesData, forOrAgainstsData));
                });
        }
    }

    private getForOrAgainstsData(): Promise<ForOrAgainstData[]> {
        if (this.forOrAgainstsData) {
            return Promise.resolve(this.forOrAgainstsData);
        } else {
            return new Promise(resolve => {
                this.http.get(this.getForOrAgainstDataFilePath())
                .subscribe(
                    (forOrAgainstsData: ForOrAgainstData[]) => {
                        this.forOrAgainstsData = forOrAgainstsData;
    
                        resolve(forOrAgainstsData);
                    },
                    error => {}
                );
            });
        }
    }
    
    private buildForOrAgainsts(themesData: ThemeData[], forOrAgainstsData: ForOrAgainstData[]): ForOrAgainst[] {
        const forOrAgainsts: ForOrAgainst[] = [];

        forOrAgainstsData.forEach((forOrAgainstData: ForOrAgainstData) => {
            const themeData = _.find(themesData, (themeData: ThemeData) => { 
                return themeData.code === forOrAgainstData.theme;
            });

            forOrAgainsts.push(ForOrAgainst.constructFromData(themeData, forOrAgainstData, this.translate.getDefaultLang()));
        });

        return forOrAgainsts;
    }
}
