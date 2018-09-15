import { CommonService } from "./_services/common.service";

//region "DTO"

//region "Entrée de tour de jeu"

export abstract class TurnEntry {
    theme: string;

    public abstract initFromData(themeData: ThemeData, turnEntryData: TurnEntryData, locale: string);
}

export class Condition extends TurnEntry {
    canBeSpecified: boolean;
    label: string;

    public hydrate(theme: string, canBeSpecified: boolean, label: string) {
        this.theme = theme;
        this.canBeSpecified = canBeSpecified;
        this.label = label;
    }

    public static constructFromData(themeData: ThemeData, conditionData: ConditionData, locale: string): Condition {
        const condition = new Condition();
        condition.hydrate(themeData.label[locale], conditionData.canBeSpecified, conditionData.label);
        return condition;
    }

    public initFromData(themeData: ThemeData, conditionData: ConditionData, locale: string): void {
        this.hydrate(themeData.label[locale], conditionData.canBeSpecified, conditionData.label);
    }
}

export class ForOrAgainst extends TurnEntry {
    label: string;

    public hydrate(theme: string, label: string) {
        this.theme = theme;
        this.label = label;
    }

    public static constructFromData(themeData: ThemeData, forOrAgainstData: ForOrAgainstData, locale: string): ForOrAgainst {
        const forOrAgainst = new ForOrAgainst();
        forOrAgainst.hydrate(themeData.label[locale], forOrAgainstData.label);
        return forOrAgainst;
    }

    public initFromData(themeData: ThemeData, forOrAgainstData: ForOrAgainstData, locale: string): void {
        this.hydrate(themeData.label[locale], forOrAgainstData.label);
    }
}

//endregion

//region "Tour de jeu"

export enum TurnType {
    CONDITION = 'condition',
    FOR_OR_AGAINST = 'for-or-against',
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

    public static constructFromCondition(condition: Condition, player?: Player): Turn {
        const sipNumber = CommonService.getRandomSipNumber()
        const command = CommonService.random() ? CommonService.DRINK_COMMAND : CommonService.GIVE_OUT_COMMAND;
        const sipSuffix = sipNumber !== CommonService.ONE_SIP_NUMBER ? CommonService.SIP_SUFFIX_PLURAL : CommonService.SIP_SUFFIX_SINGULAR;

        if (player !== undefined && condition.canBeSpecified) {
            const label = condition.label
                .replace(CommonService.DATA_PLAYER_KEY_TO_REPLACE, player.name + CommonService.PLAYER_SUFFIX)
                .replace(CommonService.DATA_COMMAND_AT_START_REGEX_TO_REPLACE, CommonService.capitalize(command))
                .replace(CommonService.DATA_COMMAND_REGEX_TO_REPLACE, command)
                .replace(CommonService.DATA_SIP_NUMBER_KEY_TO_REPLACE, sipNumber)
                .replace(CommonService.DATA_SIP_SUFFIX_KEY_TO_REPLACE, sipSuffix);

            return new Turn(TurnType.CONDITION, label, sipNumber, sipSuffix);
        } else {
            const label = condition.label
                .replace(CommonService.DATA_PLAYER_KEY_TO_REPLACE, '')
                .replace(CommonService.DATA_COMMAND_AT_START_REGEX_TO_REPLACE, CommonService.capitalize(command))
                .replace(CommonService.DATA_COMMAND_KEY_TO_REPLACE, command)
                .replace(CommonService.DATA_SIP_NUMBER_KEY_TO_REPLACE, sipNumber)
                .replace(CommonService.DATA_SIP_SUFFIX_KEY_TO_REPLACE, sipSuffix);

            return new Turn(TurnType.CONDITION, label, sipNumber, sipSuffix);
        }
    }

    public static constructFromForOrAgainst(forOrAgainst: ForOrAgainst): Turn {
        const sipNumber = CommonService.getRandomSipNumber()
        const sipSuffix = sipNumber !== CommonService.ONE_SIP_NUMBER ? CommonService.SIP_SUFFIX_PLURAL : CommonService.SIP_SUFFIX_SINGULAR;

        return new Turn(TurnType.FOR_OR_AGAINST, forOrAgainst.label, sipNumber, sipSuffix);
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
    canBeSpecified: boolean;
    label: string;
}

export class ForOrAgainstData extends TurnEntryData {
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