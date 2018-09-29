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
        const playerLabel = player !== undefined ? player.name + CommonService.PLAYER_SUFFIX : CommonService.getNoPlayerLabel(turnType);

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
    timeInSecondsLeft: number;
    interval;

    constructor(timeInSecondsLeft: number) {
        this.timeInSecondsLeft = timeInSecondsLeft;
    }

    // TODO : promise au lieu de callback ?
    start(callback: Function) {
        this.interval = setInterval(() => {
            if (this.timeInSecondsLeft > 0) {
                this.timeInSecondsLeft--;
            } else {
                this.pause();
                callback();
            }
        }, 1000);
    }

    pause() {
        clearInterval(this.interval);
    }
}

// endRegion