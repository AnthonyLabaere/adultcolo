import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as _ from 'lodash';
import { Condition, ConditionData, ForOrAgainst, ForOrAgainstData, Game, GameData, TurnEntry, TurnEntryData, TurnType, Instead, InsteadData, Song, SongData, ListData, List, LongWinded, LongWindedData, Movie, MovieData } from "../entities";
import { CommonService } from "./common.service";

@Injectable()
export class TurnEntryService {

    private turnEntriesDataMap: Map<TurnType, TurnEntryData[]> = new Map();
    private turnEntriesMap: Map<TurnType, TurnEntry[]> = new Map();

    constructor(private http: HttpClient, private translate: TranslateService) {

    }

    private getTurnEntryDataFilePath(turnType: TurnType) {
        // TODO : vérifier que le fichier est bien rechargé après un changement de langue
        return CommonService.DATA_FILE_PATH + this.translate.getDefaultLang() + '/' + turnType.toString() + '.json';
    }

    public getTurnEntries(turnType: TurnType): Promise<TurnEntry[]> {
        if (this.turnEntriesMap.get(turnType)) {
            return Promise.resolve(this.turnEntriesMap.get(turnType));
        } else {
            return this.getTurnEntriesData(turnType)
                .then((turnEntriesData: TurnEntryData[]) => {
                    return Promise.resolve(this.buildTurnEntries(turnType, turnEntriesData));
                });
        }
    }

    private getTurnEntriesData(turnType: TurnType): Promise<TurnEntryData[]> {
        if (this.turnEntriesDataMap.get(turnType)) {
            return Promise.resolve(this.turnEntriesDataMap.get(turnType));
        } else {
            return new Promise(resolve => {
                this.http.get(this.getTurnEntryDataFilePath(turnType))
                .subscribe(
                    (turnEntriesData: TurnEntryData[]) => {
                        this.turnEntriesDataMap.set(turnType, turnEntriesData);
    
                        resolve(turnEntriesData);
                    },
                    error => {}
                );
            });
        }
    }
    
    private buildTurnEntries(turnType: TurnType, turnEntriesData: TurnEntryData[]): TurnEntry[] {
        const turnEntries: TurnEntry[] = [];

        turnEntriesData.forEach((turnEntryData: TurnEntryData) => {
            let turnEntry;
            switch(turnType) {
                case TurnType.CONDITION:
                    turnEntry = new Condition();
                    turnEntry.initFromData(<ConditionData> turnEntryData, this.translate.getDefaultLang());
                    break;
                case TurnType.FOR_OR_AGAINST:
                    turnEntry = new ForOrAgainst();
                    turnEntry.initFromData(<ForOrAgainstData> turnEntryData, this.translate.getDefaultLang());
                    break;
                case TurnType.GAME:
                    turnEntry = new Game();
                    turnEntry.initFromData(<GameData> turnEntryData, this.translate.getDefaultLang());
                    break;
                case TurnType.INSTEAD:
                    turnEntry = new Instead();
                    turnEntry.initFromData(<InsteadData> turnEntryData, this.translate.getDefaultLang());
                    break;
                case TurnType.LIST:
                    turnEntry = new List();
                    turnEntry.initFromData(<ListData> turnEntryData, this.translate.getDefaultLang());
                    break;
                case TurnType.LONG_WINDED:
                    turnEntry = new LongWinded();
                    turnEntry.initFromData(<LongWindedData> turnEntryData, this.translate.getDefaultLang());
                    break;
                case TurnType.MOVIE:
                    turnEntry = new Movie();
                    turnEntry.initFromData(<MovieData> turnEntryData, this.translate.getDefaultLang());
                    break;
                case TurnType.SONG:
                    turnEntry = new Song();
                    turnEntry.initFromData(<SongData> turnEntryData, this.translate.getDefaultLang());
                    break;
                default:
                    break;
            }
            turnEntries.push(turnEntry);
            
        });

        return turnEntries;
    }
}
