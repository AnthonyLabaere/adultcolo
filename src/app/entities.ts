import { CommonService } from "./_services/common.service";

//region "DTO"

//region "Entrée de tour de jeu"

export abstract class TurnEntry {
    theme: string;
    labels: string[];
    
    protected hydrate(theme: string, labels: string[]) {
        this.theme = theme;
        this.labels = labels;
    }

    public abstract initFromData(themeData: ThemeData, turnEntryData: TurnEntryData, locale: string);
}

export class Condition extends TurnEntry {
    public initFromData(themeData: ThemeData, conditionData: ConditionData, locale: string): void {
        this.hydrate(themeData.label[locale], conditionData.labels);
    }
}

export class ForOrAgainst extends TurnEntry {
    public initFromData(themeData: ThemeData, forOrAgainstData: ForOrAgainstData, locale: string): void {
        this.hydrate(themeData.label[locale], forOrAgainstData.labels);
    }
}

export class Game extends TurnEntry {
    public initFromData(themeData: ThemeData, gameData: GameData, locale: string): void {
        this.hydrate(themeData.label[locale], gameData.labels);
    }
}

export class Instead extends TurnEntry {
    public initFromData(themeData: ThemeData, insteadData: InsteadData, locale: string): void {
        this.hydrate(themeData.label[locale], insteadData.labels);
    }
}

export class List extends TurnEntry {
    public initFromData(themeData: ThemeData, listData: ListData, locale: string): void {
        this.hydrate(themeData.label[locale], listData.labels);
    }
}

export class Song extends TurnEntry {
    public initFromData(themeData: ThemeData, songData: SongData, locale: string): void {
        this.hydrate(themeData.label[locale], songData.labels);
    }
}

//endregion

//region "Tour de jeu"

export enum TurnType {
    CONDITION = 'condition',
    FOR_OR_AGAINST = 'for-or-against',
    INSTEAD = 'instead',
    GAME = 'game',
    LIST = 'list',
    SONG = 'song',
}

export class Turn {
    type: TurnType;
    labels: string[];
    sipNumber: string;
    sipSuffix: string;
    playerLabel: string;

    constructor(type: TurnType, labels: string[], sipNumber: string, sipSuffix: string, playerLabel: string) {
        this.type = type;
        this.labels = labels;
        this.sipNumber = sipNumber;
        this.sipSuffix = sipSuffix;
        this.playerLabel = playerLabel;
    }

    public static constructFromTurnEntry(turnEntry: TurnEntry, turnType: TurnType, player?: Player): Turn {
        const sipNumber = CommonService.getRandomSipNumber();
        const singularCommand = CommonService.random() ? CommonService.DRINK_SINGULAR_COMMAND : CommonService.GIVE_OUT_SINGULAR_COMMAND;
        const pluralCommand = CommonService.random() ? CommonService.DRINK_PLURAL_COMMAND : CommonService.GIVE_OUT_PLURAL_COMMAND;
        const sipSuffix = sipNumber !== CommonService.ONE_SIP_NUMBER ? CommonService.SIP_SUFFIX_PLURAL : CommonService.SIP_SUFFIX_SINGULAR;
        const playerLabel = CommonService.getPlayerLabel(turnType, player);

        const labels = CommonService.replaceLabelsParameters(turnEntry.labels, singularCommand, pluralCommand, sipNumber, sipSuffix, playerLabel);

        return new Turn(turnType, labels, sipNumber, sipSuffix, playerLabel);
    }
}

// endRegion

export class Player {
    name: string;
}

// endRegion

//region data

export abstract class TurnEntryData {
    // TODO : retirer les thèmes, ça sera probablement toujours inutile 
    theme: number;
    labels: string[];
}

export class ConditionData extends TurnEntryData {}

export class ForOrAgainstData extends TurnEntryData {}

export class GameData extends TurnEntryData {}

export class InsteadData extends TurnEntryData {}

export class ListData extends TurnEntryData {}

export class SongData extends TurnEntryData {}

export class ThemeData {
    code: number;
    label: LocalizedString;
}

// endRegion

//region Utilitaires

export class LocalizedString {
    fr: string;
    en: string;

    constructor(fr: string, en: string) {
        this.fr = fr;
        this.en = en;
    }
}

export class Timer {
    // TODO : à mettre ailleurs ?
    private static TIMER_TIME_SECONDS_WITH_PLAYERS = 10; 
    private static TIMER_TIME_SECONDS_WITHOUT_PLAYERS = 15; 

    private static INTERVAL_IN_MILLI_SECONDS = 10;

    totalTimeInMilliSeconds: number;
    timeInMilliSecondsLeft: number;
    interval;

    constructor(withPlayers: boolean) {
        if (withPlayers) {
            this.totalTimeInMilliSeconds = 1000 * Timer.TIMER_TIME_SECONDS_WITH_PLAYERS;
            this.timeInMilliSecondsLeft = 1000 * Timer.TIMER_TIME_SECONDS_WITH_PLAYERS;
        } else {
            this.totalTimeInMilliSeconds = 1000 * Timer.TIMER_TIME_SECONDS_WITHOUT_PLAYERS;
            this.timeInMilliSecondsLeft = 1000 * Timer.TIMER_TIME_SECONDS_WITHOUT_PLAYERS;
        }

    }

    // TODO : promise au lieu de callback ?
    start(callback: Function) {
        this.interval = setInterval(() => {
            if (this.timeInMilliSecondsLeft > 0) {
                this.timeInMilliSecondsLeft = this.timeInMilliSecondsLeft - Timer.INTERVAL_IN_MILLI_SECONDS;
            } else {
                this.stop();
                callback();
            }
        }, Timer.INTERVAL_IN_MILLI_SECONDS);
    }

    stop() {
        clearInterval(this.interval);
    }

    progressPercent(): number {
        return 100 * (this.totalTimeInMilliSeconds - this.timeInMilliSecondsLeft) / this.totalTimeInMilliSeconds;
    }
}

export class ValueWithWeight<T> {
    value: T;
    weight: number;

    constructor(value: T, weight: number) {
        this.value = value;
        this.weight = weight;
    }
}

// endRegion