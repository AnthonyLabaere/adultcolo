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
    labels: TurnLabel;

    constructor(theme: string, labels: TurnLabel) {
        super(theme);
        this.labels = labels;
    }

    public static constructFromData(themeData: ThemeData, conditionData: ConditionData, locale: string): Condition {
        return new Condition(themeData.label[locale], TurnLabel.constructFromData(conditionData.labels));
    }
}

export class TurnLabel {
    generic: string;
    specific: string;

    constructor(generic: string, specific: string) {
        this.generic = generic;
        this.specific = specific;
    }

    public static constructFromData(gamingLabelData: TurnLabelData): TurnLabel {
        return new TurnLabel(gamingLabelData.generic, gamingLabelData.specific);
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
        if (player !== undefined && !CommonService.isEmpty(condition.labels.specific)) {
            return new Turn(TurnType.Condition, condition.theme, condition.labels.specific.replace(CommonService.DATA_PLAYER_KEY_TO_REPLACE, player.name));
        } else {
            return new Turn(TurnType.Condition, condition.theme, condition.labels.generic);
        }
    }
}

// endRegion

export class Player {
    name: string;
}

// endRegion

//region data

export class ConditionData {
    theme: number;
    labels: TurnLabelData;
}

export class TurnLabelData {
    generic: string;
    specific: string;
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