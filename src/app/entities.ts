import { CommonService } from "./_services/common.service";
import { environment as ENV } from '../environments/environment';

//region "DTO"

//region "Entrée de tour de jeu"

export abstract class TurnEntry {
    bigSip: boolean;
    mandatoryPlayers: boolean;
    withTimer: boolean;
    labels: string[];
    descriptions: string[];
    
    public hydrate(bigSip: boolean, mandatoryPlayers:boolean, withTimer:boolean, labels: string[], descriptions: string[]) {
        this.bigSip = bigSip;
        this.mandatoryPlayers = mandatoryPlayers;
        this.withTimer = withTimer;
        this.labels = labels;
        this.descriptions = descriptions;
    }

    public initFromData(turnEntryData: TurnEntryData, locale: string): void {
        this.hydrate(turnEntryData.bigSip, turnEntryData.mandatoryPlayers, turnEntryData.withTimer, turnEntryData.labels, turnEntryData.descriptions);
    }
}

export class Condition extends TurnEntry {}

export class ForOrAgainst extends TurnEntry {}

export class Game extends TurnEntry {}

export class General extends TurnEntry {}

export class Instead extends TurnEntry {}

export class List extends TurnEntry {}

export class LongWinded extends TurnEntry {}

export class Movie extends TurnEntry {}

export class Song extends TurnEntry {}

//endregion

//region "Tour de jeu"

export enum TurnType {
    CONDITION = 'condition',
    FOR_OR_AGAINST = 'for-or-against',
    GAME = 'game',
    GENERAL = 'general',
    INSTEAD = 'instead',
    LIST = 'list',
    LONG_WINDED = 'long-winded',
    MOVIE = 'movie',
    SONG = 'song',
}

export class TurnTypeParameters {
    withTitle: boolean;
    withDescription: boolean;
    withTimer: boolean;

    constructor(withTitle: boolean, withDescription: boolean, withTimer: boolean) {
        this.withTitle = withTitle;
        this.withDescription = withDescription;
        this.withTimer = withTimer;
    }

    static TURN_TYPE_PARAMETERS:any = {
        [TurnType.CONDITION]: new TurnTypeParameters(false, false, false),
        [TurnType.FOR_OR_AGAINST]: new TurnTypeParameters(true, true, false),
        [TurnType.GAME]: new TurnTypeParameters(true, false, false),
        [TurnType.GENERAL]: new TurnTypeParameters(false, false, false),
        [TurnType.INSTEAD]: new TurnTypeParameters(true, true, false),
        [TurnType.LIST]: new TurnTypeParameters(true, true, false),
        [TurnType.LONG_WINDED]: new TurnTypeParameters(false, false, false),
        [TurnType.MOVIE]: new TurnTypeParameters(true, true, true),
        [TurnType.SONG]: new TurnTypeParameters(true, true, true)
    };
}

export class Turn {
    type: TurnType;
    labels: string[];
    descriptions: string[];
    sipNumber: number;
    playerLabel: string;
    secondPlayerLabel: string;
    withTimer: boolean;

    constructor(type: TurnType, labels: string[], descriptions: string[], sipNumber: number, playerLabel: string, secondPlayerLabel: string, withTimer: boolean) {
        this.type = type;
        this.labels = labels;
        this.descriptions = descriptions;
        this.sipNumber = sipNumber;
        this.playerLabel = playerLabel;
        this.secondPlayerLabel = secondPlayerLabel;
        this.withTimer = withTimer;
    }

    /**
     * Construction d'un tour contenant tous les libellés
     */
    public static constructFromTurnEntry(turnEntry: TurnEntry, turnType: TurnType, player?: Player, secondPlayer?: Player): Turn {
        const sipNumber = CommonService.getRandomSipNumber(turnEntry.bigSip);
        const drink = CommonService.random();
        const playerLabel = CommonService.getPlayerLabel(turnType, player);
        const secondPlayerLabel = CommonService.getPlayerLabel(turnType, secondPlayer);

        const labels = CommonService.replaceLabelsParameters(turnEntry.labels, drink, sipNumber, playerLabel, secondPlayerLabel);
        let descriptions: string[];
        if (turnEntry.descriptions) {
            descriptions = CommonService.replaceLabelsParameters(turnEntry.descriptions, drink, sipNumber, playerLabel, secondPlayerLabel);
        }

        return new Turn(turnType, labels, descriptions, sipNumber, playerLabel, secondPlayerLabel, turnEntry.withTimer);
    }

    /**
     * Construction d'un tableau de tours contenant chacun un des libellés
     */
    public static constructDecoupledFromTurnEntry(turnEntry: TurnEntry, turnType: TurnType, player?: Player, secondPlayer?: Player): Turn[] {
        const sipNumber = CommonService.getRandomSipNumber();
        const drink = CommonService.random();
        const playerLabel = CommonService.getPlayerLabel(turnType, player);
        const secondPlayerLabel = CommonService.getPlayerLabel(turnType, secondPlayer);

        const labels = CommonService.replaceLabelsParameters(turnEntry.labels, drink, sipNumber, playerLabel, secondPlayerLabel);
        let descriptions: string[];
        if (turnEntry.descriptions) {
            descriptions = CommonService.replaceLabelsParameters(turnEntry.descriptions, drink, sipNumber, playerLabel, secondPlayerLabel);
        }

        const turns: Turn[] = [];
        const length = labels.length;
        for (let i = 0; i < length; i++) {
            let description: string;
            if (descriptions && descriptions.length === length){
                description = descriptions[i];
            }

            turns.push(new Turn(turnType, [labels[i]], [description], sipNumber, playerLabel, secondPlayerLabel, turnEntry.withTimer));
        }

        return turns;
    }
}

// endRegion

export class Player {
    name: string;
}

// endRegion

//region data

export abstract class TurnEntryData {
    bigSip: boolean;
    mandatoryPlayers: boolean;
    withTimer: boolean;
    labels: string[];
    descriptions: string[];
}

export class ConditionData extends TurnEntryData {}

export class ForOrAgainstData extends TurnEntryData {}

export class GameData extends TurnEntryData {}

export class GeneralData extends TurnEntryData {}

export class InsteadData extends TurnEntryData {}

export class ListData extends TurnEntryData {}

export class LongWindedData extends TurnEntryData {}

export class MovieData extends TurnEntryData {}

export class SongData extends TurnEntryData {}

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
    started: boolean = false;
    totalTimeInMilliSeconds: number;
    timeInMilliSecondsLeft: number;
    interval;

    constructor(type: TurnType) {
        let time: number;
        if (type === TurnType.GAME) {
            time = ENV.TIMER_GAME_TIME;
        } else {
            time = ENV.TIMER_DEFAULT_TIME;
        }

        this.totalTimeInMilliSeconds = 1000 * time;
        this.timeInMilliSecondsLeft = 1000 * time;
    }

    // TODO : promise au lieu de callback ?
    start(callback: Function) {
        this.started = true;

        this.interval = setInterval(() => {
            if (this.timeInMilliSecondsLeft > 0) {
                this.timeInMilliSecondsLeft = this.timeInMilliSecondsLeft - ENV.TIMER_INTERVAL_IN_MILLI_SECONDS;
            } else {
                this.stop();
                callback();
            }
        }, ENV.TIMER_INTERVAL_IN_MILLI_SECONDS);
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