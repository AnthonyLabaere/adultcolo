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

    constructor(type: TurnType, labels: string[], sipNumber: string, sipSuffix: string) {
        this.type = type;
        this.labels = labels;
        this.sipNumber = sipNumber;
        this.sipSuffix = sipSuffix;
    }

    // TODO : une seule méthode ? A voir avec les autres types de tour de jeu.

    public static constructFromCondition(condition: Condition, player?: Player): Turn {
        const sipNumber = CommonService.getRandomSipNumber();
        const singularCommand = CommonService.random() ? CommonService.DRINK_SINGULAR_COMMAND : CommonService.GIVE_OUT_SINGULAR_COMMAND;
        const pluralCommand = CommonService.random() ? CommonService.DRINK_PLURAL_COMMAND : CommonService.GIVE_OUT_PLURAL_COMMAND;
        const sipSuffix = sipNumber !== CommonService.ONE_SIP_NUMBER ? CommonService.SIP_SUFFIX_PLURAL : CommonService.SIP_SUFFIX_SINGULAR;

        const labels = CommonService.replaceLabelsParameters(condition.labels, singularCommand, pluralCommand, sipNumber, sipSuffix, CommonService.PLAYER_NONE, player);

        return new Turn(TurnType.CONDITION, labels, sipNumber, sipSuffix);
    }

    public static constructFromForOrAgainst(forOrAgainst: ForOrAgainst): Turn {
        const sipNumber = CommonService.getRandomSipNumber()
        const sipSuffix = sipNumber !== CommonService.ONE_SIP_NUMBER ? CommonService.SIP_SUFFIX_PLURAL : CommonService.SIP_SUFFIX_SINGULAR;

        return new Turn(TurnType.FOR_OR_AGAINST, forOrAgainst.labels, sipNumber, sipSuffix);
    }

    public static constructFromGame(game: Game, player?: Player): Turn {
        const sipNumber = CommonService.getRandomSipNumber();
        const singularCommand = CommonService.random() ? CommonService.DRINK_SINGULAR_COMMAND : CommonService.GIVE_OUT_SINGULAR_COMMAND;
        const pluralCommand = CommonService.random() ? CommonService.DRINK_PLURAL_COMMAND : CommonService.GIVE_OUT_PLURAL_COMMAND;
        const sipSuffix = sipNumber !== CommonService.ONE_SIP_NUMBER ? CommonService.SIP_SUFFIX_PLURAL : CommonService.SIP_SUFFIX_SINGULAR;

        const labels = CommonService.replaceLabelsParameters(game.labels, singularCommand, pluralCommand, sipNumber, sipSuffix, CommonService.PLAYER_USER + CommonService.PLAYER_SUFFIX, player);

        return new Turn(TurnType.GAME, labels, sipNumber, sipSuffix);
    }

    public static constructFromInstead(instead: Instead): Turn {
        const sipNumber = CommonService.getRandomSipNumber()
        const sipSuffix = sipNumber !== CommonService.ONE_SIP_NUMBER ? CommonService.SIP_SUFFIX_PLURAL : CommonService.SIP_SUFFIX_SINGULAR;

        return new Turn(TurnType.INSTEAD, instead.labels, sipNumber, sipSuffix);
    }

    public static constructFromList(list: List, player?: Player): Turn {
        const sipNumber = CommonService.getRandomSipNumber();
        const singularCommand = CommonService.random() ? CommonService.DRINK_SINGULAR_COMMAND : CommonService.GIVE_OUT_SINGULAR_COMMAND;
        const pluralCommand = CommonService.random() ? CommonService.DRINK_PLURAL_COMMAND : CommonService.GIVE_OUT_PLURAL_COMMAND;
        const sipSuffix = sipNumber !== CommonService.ONE_SIP_NUMBER ? CommonService.SIP_SUFFIX_PLURAL : CommonService.SIP_SUFFIX_SINGULAR;

        const labels = CommonService.replaceLabelsParameters(list.labels, singularCommand, pluralCommand, sipNumber, sipSuffix, CommonService.PLAYER_USER + CommonService.PLAYER_SUFFIX, player);

        return new Turn(TurnType.LIST, labels, sipNumber, sipSuffix);
    }

    public static constructFromSong(song: Song): Turn {
        const sipNumber = CommonService.getRandomSipNumber()
        const sipSuffix = sipNumber !== CommonService.ONE_SIP_NUMBER ? CommonService.SIP_SUFFIX_PLURAL : CommonService.SIP_SUFFIX_SINGULAR;

        return new Turn(TurnType.SONG, song.labels, sipNumber, sipSuffix);
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

// endRegion