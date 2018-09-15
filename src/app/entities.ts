import { CommonService } from "./_services/common.service";

//region "DTO"

//region "Entrée de tour de jeu"

export abstract class TurnEntry {
    theme: string;

    constructor(theme: string) {
        this.theme = theme;
    }
}

export class Condition extends TurnEntry {
    canBeSpecified: boolean;
    label: string;

    constructor(theme: string, canBeSpecified: boolean, label: string) {
        super(theme);
        this.canBeSpecified = canBeSpecified;
        this.label = label;
    }

    public static constructFromData(themeData: ThemeData, conditionData: ConditionData, locale: string): Condition {
        return new Condition(themeData.label[locale], conditionData.canBeSpecified, conditionData.label);
    }
}

//endregion

//region "Tour de jeu"

export enum TurnType {
    Condition = 'condition',
}

export class Turn {
    type: TurnType;
    title: string;
    label: string;

    constructor(type: TurnType, title: string, label: string) {
        this.type = type;
        this.title = title;
        this.label = label;
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

            return new Turn(TurnType.Condition, null, label);
        } else {
            const label = condition.label
                .replace(CommonService.DATA_PLAYER_KEY_TO_REPLACE, '')
                .replace(CommonService.DATA_COMMAND_AT_START_REGEX_TO_REPLACE, CommonService.capitalize(command))
                .replace(CommonService.DATA_COMMAND_KEY_TO_REPLACE, command)
                .replace(CommonService.DATA_SIP_NUMBER_KEY_TO_REPLACE, sipNumber)
                .replace(CommonService.DATA_SIP_SUFFIX_KEY_TO_REPLACE, sipSuffix);

            return new Turn(TurnType.Condition, null, label);
        }
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