import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as _ from 'lodash';
import { Condition, ConditionData, ThemeData } from "../entities";
import { CommonService } from "./common.service";
import { ThemeService } from "./theme.service";


@Injectable()
export class ConditionService {

    private static CONDITIONS_DATA_FILE_NAME = 'conditions.json';

    private conditionsData: ConditionData[];
    private conditions: Condition[];

    constructor(private http: HttpClient, private translate: TranslateService, private themeService: ThemeService) {

    }

    private getConditionDataFilePath() {
        // TODO : vérifier que le fichier est bien rechargé après un changement de langue
        return CommonService.DATA_FILE_PATH + this.translate.getDefaultLang() + '/' + ConditionService.CONDITIONS_DATA_FILE_NAME;;
    }

    public getConditions(): Promise<Condition[]> {
        if (this.conditions) {
            return Promise.resolve(this.conditions);
        } else {
            let themesData;
            return this.themeService.getThemesData()
                .then((themesDataTmp: ThemeData[]) => {
                    themesData = themesDataTmp;
                    return this.getConditionsData();
                })
                .then((conditionsData: ConditionData[]) => {
                    return Promise.resolve(this.buildConditions(themesData, conditionsData));
                });
        }
    }

    private getConditionsData(): Promise<ConditionData[]> {
        if (this.conditionsData) {
            return Promise.resolve(this.conditionsData);
        } else {
            return new Promise(resolve => {
                this.http.get(this.getConditionDataFilePath())
                .subscribe(
                    (conditionsData: ConditionData[]) => {
                        this.conditionsData = conditionsData;
    
                        resolve(conditionsData);
                    },
                    error => {}
                );
            });
        }
    }
    
    private buildConditions(themesData: ThemeData[], conditionsData: ConditionData[]): Condition[] {
        const conditions: Condition[] = [];

        conditionsData.forEach((conditionData: ConditionData) => {
            const themeData = _.find(themesData, (themeData: ThemeData) => { 
                return themeData.code === conditionData.theme
            });

            conditions.push(Condition.constructFromData(themeData, conditionData, this.translate.getDefaultLang()));
        });

        return conditions;
    }
}
