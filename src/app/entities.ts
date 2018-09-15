import { CommonService } from "./_services/common.service";

//region "DTO"

//region "Tour de jeu"

export abstract class AbstractTurn {
    theme: string;

    constructor(theme: string) {
        this.theme = theme;
    }
}

export class Condition extends AbstractTurn {
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

        if (player !== undefined && condition.canBeSpecified) {
            const label = condition.label
                .replace(CommonService.DATA_COMMAND_KEY_TO_REPLACE, CommonService.random() ? CommonService.DRINK_COMMAND : CommonService.GIVE_OUT_COMMAND)
                .replace(CommonService.DATA_SIP_NUMBER_KEY_TO_REPLACE, sipNumber)
                .replace(CommonService.DATA_SIP_SUFFIX_KEY_TO_REPLACE, sipNumber !== CommonService.ONE_SIP_NUMBER ? 's' : '')
                .replace(CommonService.DATA_PLAYER_KEY_TO_REPLACE, player.name + ', ');

            return new Turn(TurnType.Condition, condition.theme, label);
        } else {
            const label = condition.label
                .replace(CommonService.DATA_COMMAND_KEY_TO_REPLACE, CommonService.random() ? 
                    CommonService.capitalize(CommonService.DRINK_COMMAND) : CommonService.capitalize(CommonService.GIVE_OUT_COMMAND))
                .replace(CommonService.DATA_SIP_NUMBER_KEY_TO_REPLACE, sipNumber)
                .replace(CommonService.DATA_SIP_SUFFIX_KEY_TO_REPLACE, sipNumber !== CommonService.ONE_SIP_NUMBER ? 's' : '')
                .replace(CommonService.DATA_PLAYER_KEY_TO_REPLACE, '');

            return new Turn(TurnType.Condition, condition.theme, label);
        }
    }
}

// endRegion

export class Player {
    name: string;
}

// endRegion

//region data

export abstract class AbstractTurnData {
    theme: number;
}

export class ConditionData extends AbstractTurnData {
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