
//region "DTO"

//region "Tour de jeu"

export abstract class Turn {
    theme: string;

    constructor(theme: string) {
        this.theme = theme;
    }
}

export class Condition extends Turn {
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
    general: string;
    specific: string;

    constructor(general: string, specific: string) {
        this.general = general;
        this.specific = specific;
    }

    public static constructFromData(gamingLabelData: TurnLabelData): TurnLabel {
        return new TurnLabel(gamingLabelData.general, gamingLabelData.specific);
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
    general: string;
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