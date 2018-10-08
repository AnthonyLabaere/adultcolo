import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as _ from 'lodash';
import { Ad, AdData, Cartoon, CartoonData, Condition, ConditionData, ForOrAgainst, ForOrAgainstData, Game, GameData, GeneralData, Instead, InsteadData, List, ListData, LongWinded, LongWindedData, Movie, MovieData, Song, SongData, TurnEntry, TurnEntryData, TurnType } from "../entities";
import { CommonService } from "./common.service";

@Injectable()
export class TurnEntryService {

    private static TURN_SUB_TYPES = {
        [TurnType.AD]: ['alcool', 'drink', 'food', 'restaurant', 'shop', 'transport'],
        [TurnType.CONDITION]: ['alcool', 'child', 'family', 'general', 'old', 'sentimental', 'work'],
        [TurnType.CARTOON]: ['disney']
    }

    private turnEntriesDataMap: Map<TurnType, TurnEntryData[]> = new Map();
    private turnEntriesMap: Map<TurnType, TurnEntry[]> = new Map();

    constructor(private http: HttpClient, private translate: TranslateService) {

    }

    private getTurnEntryDataFilePath(turnType: TurnType, subTurnType?: string) {
        // TODO : vérifier que le fichier est bien rechargé après un changement de langue
        let turnEntryDataFilePath = CommonService.DATA_FILE_PATH + this.translate.getDefaultLang() + '/' + turnType.toString() + '/' + turnType.toString();
        if (subTurnType !== undefined) {
            turnEntryDataFilePath += '-' + subTurnType;
        }
        turnEntryDataFilePath += '.json';
        return turnEntryDataFilePath;
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
            const promises: Promise<TurnEntryData[]>[] = []
            // Chargement du fichier principal (exemple : conditions.json)
            promises.push(this.loadTurnEntriesData(turnType));
            if (TurnEntryService.TURN_SUB_TYPES[turnType] !== undefined) {
                // Si des autres fichiers du même sont présents (cette information est dans TURN_SUB_TYPES)
                // Alors ils sont aussi ajoutés (exemple : condition-alcool.json)
                TurnEntryService.TURN_SUB_TYPES[turnType].forEach(subType => {
                    promises.push(this.loadTurnEntriesData(turnType, subType));
                });
            }

            return Promise.all(promises)
                .then((turnEntriesDatas: TurnEntryData[][]) => {
                    // Mise à plat des résultats
                    const turnEntriesData = _.flatten(turnEntriesDatas)
                    this.turnEntriesDataMap.set(turnType, turnEntriesData);
                    return Promise.resolve(turnEntriesData);
                });
        }
    }

    private loadTurnEntriesData(turnType: TurnType, subTurnType?: string): Promise<TurnEntryData[]> {
        return new Promise(resolve => {
            this.http.get(this.getTurnEntryDataFilePath(turnType, subTurnType))
            .subscribe(
                (turnEntriesData: TurnEntryData[]) => {
                    resolve(turnEntriesData);
                },
                error => {}
            );
        });
    }
    
    private buildTurnEntries(turnType: TurnType, turnEntriesData: TurnEntryData[]): TurnEntry[] {
        const turnEntries: TurnEntry[] = [];

        turnEntriesData.forEach((turnEntryData: TurnEntryData) => {
            let turnEntry;
            switch(turnType) {
                case TurnType.AD:
                    turnEntry = new Ad();
                    turnEntry.initFromData(<AdData> turnEntryData, this.translate.getDefaultLang());
                    break;
                case TurnType.CARTOON:
                    turnEntry = new Cartoon();
                    turnEntry.initFromData(<CartoonData> turnEntryData, this.translate.getDefaultLang());
                    break;
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
                case TurnType.GENERAL:
                    turnEntry = new Game();
                    turnEntry.initFromData(<GeneralData> turnEntryData, this.translate.getDefaultLang());
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
