import { CommonService } from "./_services/common.service";

//region "DTO"

//region "Entrée de tour de jeu"

export abstract class TurnEntry {
    theme: string;

    public abstract initFromData(themeData: ThemeData, turnEntryData: TurnEntryData, locale: string);
}

export class Condition extends TurnEntry {
    label: string;

    public hydrate(theme: string, label: string) {
        this.theme = theme;
        this.label = label;
    }

    public initFromData(themeData: ThemeData, conditionData: ConditionData, locale: string): void {
        this.hydrate(themeData.label[locale], conditionData.label);
    }
}

export class ForOrAgainst extends TurnEntry {
    label: string;

    public hydrate(theme: string, label: string) {
        this.theme = theme;
        this.label = label;
    }

    public initFromData(themeData: ThemeData, forOrAgainstData: ForOrAgainstData, locale: string): void {
        this.hydrate(themeData.label[locale], forOrAgainstData.label);
    }
}

export class Game extends TurnEntry {
    label: string;

    public hydrate(theme: string, label: string) {
        this.theme = theme;
        this.label = label;
    }

    public initFromData(themeData: ThemeData, gameData: GameData, locale: string): void {
        this.hydrate(themeData.label[locale], gameData.label);
    }
}

//endregion

//region "Tour de jeu"

export enum TurnType {
    CONDITION = 'condition',
    FOR_OR_AGAINST = 'for-or-against',
    GAME = 'game',
}

export class Turn {
    type: TurnType;
    label: string;
    sipNumber: string;
    sipSuffix: string;

    constructor(type: TurnType, label: string, sipNumber: string, sipSuffix: string) {
        this.type = type;
        this.label = label;
        this.sipNumber = sipNumber;
        this.sipSuffix = sipSuffix;
    }

    // TODO : une seule méthode ? A voir avec les autres types de tour de jeu.

    public static constructFromCondition(condition: Condition, player?: Player): Turn {
        const sipNumber = CommonService.getRandomSipNumber();
        const singularCommand = CommonService.random() ? CommonService.DRINK_SINGULAR_COMMAND : CommonService.GIVE_OUT_SINGULAR_COMMAND;
        const pluralCommand = CommonService.random() ? CommonService.DRINK_PLURAL_COMMAND : CommonService.GIVE_OUT_PLURAL_COMMAND;
        const sipSuffix = sipNumber !== CommonService.ONE_SIP_NUMBER ? CommonService.SIP_SUFFIX_PLURAL : CommonService.SIP_SUFFIX_SINGULAR;

        const label = CommonService.replaceLabelParameters(condition.label, singularCommand, pluralCommand, sipNumber, sipSuffix, player);

        return new Turn(TurnType.CONDITION, label, sipNumber, sipSuffix);
    }

    public static constructFromForOrAgainst(forOrAgainst: ForOrAgainst): Turn {
        const sipNumber = CommonService.getRandomSipNumber()
        const sipSuffix = sipNumber !== CommonService.ONE_SIP_NUMBER ? CommonService.SIP_SUFFIX_PLURAL : CommonService.SIP_SUFFIX_SINGULAR;

        return new Turn(TurnType.FOR_OR_AGAINST, forOrAgainst.label, sipNumber, sipSuffix);
    }

    public static constructFromGame(game: Game, player?: Player): Turn {
        const sipNumber = CommonService.getRandomSipNumber();
        const singularCommand = CommonService.random() ? CommonService.DRINK_SINGULAR_COMMAND : CommonService.GIVE_OUT_SINGULAR_COMMAND;
        const pluralCommand = CommonService.random() ? CommonService.DRINK_PLURAL_COMMAND : CommonService.GIVE_OUT_PLURAL_COMMAND;
        const sipSuffix = sipNumber !== CommonService.ONE_SIP_NUMBER ? CommonService.SIP_SUFFIX_PLURAL : CommonService.SIP_SUFFIX_SINGULAR;

        const label = CommonService.replaceLabelParameters(game.label, singularCommand, pluralCommand, sipNumber, sipSuffix, player);

        return new Turn(TurnType.GAME, label, sipNumber, sipSuffix);
    }
}

// endRegion

export class Player {
    name: string;
}

// endRegion

//region data

export abstract class TurnEntryData {
    theme: number;
}

export class ConditionData extends TurnEntryData {
    label: string;
}

export class ForOrAgainstData extends TurnEntryData {
    label: string;
}

export class GameData extends TurnEntryData {
    label: string;
}

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