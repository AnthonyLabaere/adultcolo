import { environment as ENV } from '../environments/environment';
import { CommonService } from "./_services/common.service";
import { LocalizedService } from "./_services/localized.service";

//region "DTO"

//region "Entrée de tour de jeu"

/** 
 * Class abstraite d'une donnée de tour retravaillé dont doivent hériter les tours retravaillés
 */
export abstract class TurnEntry {
    bigSip: boolean;
    mandatoryPlayers: boolean;
    withTimer: boolean;
    titles: string[];
    labels: string[];
    descriptions: string[];
    
    public hydrate(bigSip: boolean, mandatoryPlayers:boolean, withTimer:boolean, titles:string[], labels: string[], descriptions: string[]) {
        this.bigSip = bigSip;
        this.mandatoryPlayers = mandatoryPlayers;
        this.withTimer = withTimer;
        this.titles = titles;
        this.labels = labels;
        this.descriptions = descriptions;
    }

    public initFromData(turnEntryData: TurnEntryData, locale: string): void {
        this.hydrate(turnEntryData.bigSip, turnEntryData.mandatoryPlayers, turnEntryData.withTimer, turnEntryData.titles, turnEntryData.labels, turnEntryData.descriptions);
    }
}

/**
 * Donnée retravaillée d'un tour de jeu de type "Publicité"
 */
export class Ad extends TurnEntry {}

/**
 * Donnée retravaillée d'un tour de jeu de type "Dessin animé"
 */
export class Cartoon extends TurnEntry {}

/**
 * Donnée retravaillée d'un tour de jeu de type "Condition"
 */
export class Condition extends TurnEntry {}

/**
 * Donnée retravaillée d'un tour de jeu de type "Pour ou contre"
 */
export class ForOrAgainst extends TurnEntry {}

/**
 * Donnée retravaillée d'un tour de jeu de type "Jeu"
 */
export class Game extends TurnEntry {}

/**
 * Donnée retravaillée d'un tour de jeu de type "Généralité"
 */
export class General extends TurnEntry {}

/**
 * Donnée retravaillée d'un tour de jeu de type "Plutôt"
 */
export class Instead extends TurnEntry {}

/**
 * Donnée retravaillée d'un tour de jeu de type "Thème"
 */
export class List extends TurnEntry {}

/**
 * Donnée retravaillée d'un tour de jeu de type "De longue haleine"
 */
export class LongWinded extends TurnEntry {}

/**
 * Donnée retravaillée d'un tour de jeu de type "Film"
 */
export class Movie extends TurnEntry {}

/**
 * Donnée retravaillée d'un tour de jeu de type "Chanson"
 */
export class Song extends TurnEntry {}

//endregion

//region "Tour de jeu"

/**
 * Type de tour de jeu
 */
export enum TurnType {
    AD = 'ad',
    CARTOON = 'cartoon',
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

/**
 * Liste différents paramètres d'un type de tour de jeu
 */
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
        [TurnType.AD]: new TurnTypeParameters(ENV.AD_PARAMETERS[0], ENV.AD_PARAMETERS[1], ENV.AD_PARAMETERS[2]),
        [TurnType.CARTOON]: new TurnTypeParameters(ENV.CARTOON_PARAMETERS[0], ENV.CARTOON_PARAMETERS[1], ENV.CARTOON_PARAMETERS[2]),
        [TurnType.CONDITION]: new TurnTypeParameters(ENV.CONDITION_PARAMETERS[0], ENV.CONDITION_PARAMETERS[1], ENV.CONDITION_PARAMETERS[2]),
        [TurnType.FOR_OR_AGAINST]: new TurnTypeParameters(ENV.FOR_OR_AGAINST_PARAMETERS[0], ENV.FOR_OR_AGAINST_PARAMETERS[1], ENV.FOR_OR_AGAINST_PARAMETERS[2]),
        [TurnType.GAME]: new TurnTypeParameters(ENV.GAME_PARAMETERS[0], ENV.GAME_PARAMETERS[1], ENV.GAME_PARAMETERS[2]),
        [TurnType.GENERAL]: new TurnTypeParameters(ENV.GENERAL_PARAMETERS[0], ENV.GENERAL_PARAMETERS[1], ENV.GENERAL_PARAMETERS[2]),
        [TurnType.INSTEAD]: new TurnTypeParameters(ENV.INSTEAD_PARAMETERS[0], ENV.INSTEAD_PARAMETERS[1], ENV.INSTEAD_PARAMETERS[2]),
        [TurnType.LIST]: new TurnTypeParameters(ENV.LIST_PARAMETERS[0], ENV.LIST_PARAMETERS[1], ENV.LIST_PARAMETERS[2]),
        [TurnType.LONG_WINDED]: new TurnTypeParameters(ENV.LONG_WINDED_PARAMETERS[0], ENV.LONG_WINDED_PARAMETERS[1], ENV.LONG_WINDED_PARAMETERS[2]),
        [TurnType.MOVIE]: new TurnTypeParameters(ENV.MOVIE_PARAMETERS[0], ENV.MOVIE_PARAMETERS[1], ENV.MOVIE_PARAMETERS[2]),
        [TurnType.SONG]: new TurnTypeParameters(ENV.SONG_PARAMETERS[0], ENV.SONG_PARAMETERS[1], ENV.SONG_PARAMETERS[2])
    };
}

/**
 * Tour de jeu d'une partie
 */
export class Turn {
    type: TurnType;
    titles: string[];
    labels: string[];
    descriptions: string[];
    sipNumber: number;
    playerLabel: string;
    secondPlayerLabel: string;
    withTimer: boolean;

    constructor(type: TurnType, titles:string[], labels: string[], descriptions: string[], sipNumber: number, playerLabel: string, secondPlayerLabel: string, withTimer: boolean) {
        this.type = type;
        this.titles = titles;
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
        const playerLabel = LocalizedService.getPlayerLabel(turnType, player);
        const secondPlayerLabel = LocalizedService.getPlayerLabel(turnType, secondPlayer);

        let titles: string[];
        if (turnEntry.titles) {
            titles = LocalizedService.replaceLabelsParameters(turnEntry.titles, drink, sipNumber, playerLabel, secondPlayerLabel);
        }
        const labels = LocalizedService.replaceLabelsParameters(turnEntry.labels, drink, sipNumber, playerLabel, secondPlayerLabel);
        let descriptions: string[];
        if (turnEntry.descriptions) {
            descriptions = LocalizedService.replaceLabelsParameters(turnEntry.descriptions, drink, sipNumber, playerLabel, secondPlayerLabel);
        }

        return new Turn(turnType, titles, labels, descriptions, sipNumber, playerLabel, secondPlayerLabel, turnEntry.withTimer);
    }

    /**
     * Construction d'un tableau de tours contenant chacun un des libellés
     */
    public static constructDecoupledFromTurnEntry(turnEntry: TurnEntry, turnType: TurnType, player?: Player, secondPlayer?: Player): Turn[] {
        const sipNumber = CommonService.getRandomSipNumber();
        const drink = CommonService.random();
        const playerLabel = LocalizedService.getPlayerLabel(turnType, player);
        const secondPlayerLabel = LocalizedService.getPlayerLabel(turnType, secondPlayer);

        let titles: string[];
        if (turnEntry.titles) {
            titles = LocalizedService.replaceLabelsParameters(turnEntry.titles, drink, sipNumber, playerLabel, secondPlayerLabel);
        }
        const labels = LocalizedService.replaceLabelsParameters(turnEntry.labels, drink, sipNumber, playerLabel, secondPlayerLabel);
        let descriptions: string[];
        if (turnEntry.descriptions) {
            descriptions = LocalizedService.replaceLabelsParameters(turnEntry.descriptions, drink, sipNumber, playerLabel, secondPlayerLabel);
        }

        const turns: Turn[] = [];
        const length = labels.length;
        for (let i = 0; i < length; i++) {
            let title: string;
            if (titles && titles.length === length){
                title = titles[i];
            }
            let description: string;
            if (descriptions && descriptions.length === length){
                description = descriptions[i];
            }

            turns.push(new Turn(turnType, [title], [labels[i]], [description], sipNumber, playerLabel, secondPlayerLabel, turnEntry.withTimer));
        }

        return turns;
    }
}

// endRegion

/**
 * Joueur
 */
export class Player {
    name: string;
}

// endRegion

//region data

/**
 * Classe abstraite d'une donnée brute de tour dont doivent hériter les données brutes
 */
export abstract class TurnEntryData {
    bigSip: boolean;
    mandatoryPlayers: boolean;
    withTimer: boolean;
    titles: string[]
    labels: string[];
    descriptions: string[];
}

/**
 * Donnée brute d'un tour de jeu de type "Publicité" 
 */
export class AdData extends TurnEntryData {}

/**
 * Donnée brute d'un tour de jeu de type "Dessin animé" 
 */
export class CartoonData extends TurnEntryData {}

/**
 * Donnée brute d'un tour de jeu de type "Condition" 
 */
export class ConditionData extends TurnEntryData {}

/**
 * Donnée brute d'un tour de jeu de type "Pour ou contre" 
 */
export class ForOrAgainstData extends TurnEntryData {}

/**
 * Donnée brute d'un tour de jeu de type "Jeu" 
 */
export class GameData extends TurnEntryData {}

/**
 * Donnée brute d'un tour de jeu de type "Généralité" 
 */
export class GeneralData extends TurnEntryData {}

/**
 * Donnée brute d'un tour de jeu de type "Plutôt" 
 */
export class InsteadData extends TurnEntryData {}

/**
 * Donnée brute d'un tour de jeu de type "Thème" 
 */
export class ListData extends TurnEntryData {}

/**
 * Donnée brute d'un tour de jeu de type "De longue haleine" 
 */
export class LongWindedData extends TurnEntryData {}

/**
 * Donnée brute d'un tour de jeu de type "Film" 
 */
export class MovieData extends TurnEntryData {}

/** 
 * Donnée brute d'un tour de jeu de type "Chanson" 
 */
export class SongData extends TurnEntryData {}

// endRegion

//region Utilitaires

/**
 * Classe d'une chaîne de caractère internationalisée
 */
export class LocalizedString {
    fr: string;
    en: string;

    constructor(fr: string, en: string) {
        this.fr = fr;
        this.en = en;
    }
}

/**
 * Classe d'un minuteur de l'application
 */
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

/**
 * Classe d'une valeur pondérée
 */
export class ValueWithWeight<T> {
    value: T;
    weight: number;

    constructor(value: T, weight: number) {
        this.value = value;
        this.weight = weight;
    }
}

// endRegion