import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as _ from 'lodash';
import { Player, TurnType, ValueWithWeight } from "../entities";
import { CommonService } from "./common.service";

/**
 * Service des chaînes de caractères localisées
 */
@Injectable()
export class LocalizedService {

    // Chaînes de caractères localizés
    public static ALCOOLS_WITH_PREPOSITION: string[];
    public static ALPHABET_FIRSTNAME: string[];
    public static ALPHABET_CITY: string[];
    public static CARDS_COLOR: string[];
    public static DISHES_SALTED: string[];
    public static FORBIDDEN_VERBS: string[];
    public static HEADS_OR_TAILS: string[];
    public static SINGERS: string[];
    public static SOUNDS: string[];
    public static SYNONYMES: string[];

    public static PLAYER_SUFFIX: string;
    public static PLAYER_NONE: string;
    public static PLAYER_PHONE_OWNER: string;
    public static PLAYER_YOUNGER: string;
    public static PLAYER_OLDER: string;
    public static PLAYER_BEARDEST: string;
    public static PLAYER_DESIGNED: string;
    public static PLAYER_FIRST: string;
    public static PLAYER_PHONE_HOLDER: string;
    public static PLAYER_HOUSE_OWNER: string;

    public static DRINK_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND: string;
    public static DRINK_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND: string;
    public static DRINK_SINGULAR_IMPERATIVE_COMMAND: string;
    public static DRINK_PLURAL_COMMAND: string;
    public static GIVE_OUT_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND: string;
    public static GIVE_OUT_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND: string;
    public static GIVE_OUT_SINGULAR_IMPERATIVE_COMMAND: string;
    public static GIVE_OUT_PLURAL_COMMAND: string;

    public static ONE_SIP_NUMBER: string;
    public static TWO_SIP_NUMBER: string;
    public static THREE_SIP_NUMBER: string;
    public static FOUR_SIP_NUMBER: string;
    public static FIVE_SIP_NUMBER: string;
    public static SIP_SUFFIX_SINGULAR: string;
    public static SIP_SUFFIX_PLURAL: string;
    public static SIP_PRONOUN_SINGULAR: string;
    public static SIP_PRONOUN_PLURAL: string;

    // Identifiants des paramètres de remplacement dans les chaînes de caractères du jeu
    public static DATA_PLAYER_KEY_TO_REPLACE = '<<player>>';
    public static DATA_SECOND_PLAYER_KEY_TO_REPLACE = '<<second-player>>';
 
    public static DATA_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND_KEY_TO_REPLACE = '<<singular-indicative-second-person-command>>';
    public static DATA_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND_KEY_TO_REPLACE = '<<singular-indicative-third-person-command>>';
    public static DATA_SINGULAR_IMPERATIVE_COMMAND_KEY_TO_REPLACE = '<<singular-imperative-command>>';
    public static DATA_PLURAL_COMMAND_KEY_TO_REPLACE = '<<plural-command>>';

    public static DATA_SIP_NUMBER_KEY_TO_REPLACE = '<<sipNumber>>';
    public static DATA_SIP_SUFFIX_KEY_TO_REPLACE = '<<sipSuffix>>';
    public static DATA_SIP_PRONOUN_KEY_TO_REPLACE = '<<sipPronoun>>';

    public static DATA_RANDOM_ALCOOL_KEY_TO_REPLACE = '<<random-alcool>>';
    public static DATA_RANDOM_LETTER_FIRSTNAME_KEY_TO_REPLACE = '<<random-letter-firstname>>';
    public static DATA_RANDOM_LETTER_CITY_KEY_TO_REPLACE = '<<random-letter-city>>';
    public static DATA_RANDOM_CARD_COLOR_KEY_TO_REPLACE = '<<random-card-color>>';
    public static DATA_RANDOM_FIRST_DISH_SALTED_KEY_TO_REPLACE = '<<random-first-dish-salted>>';
    public static DATA_RANDOM_SECOND_DISH_SALTED_KEY_TO_REPLACE = '<<random-second-dish-salted>>';
    public static DATA_RANDOM_FORBIDDEN_VERBS_KEY_TO_REPLACE = '<<random-forbidden-verb>>';
    public static DATA_RANDOM_HEADS_OR_TAILS_VERBS_KEY_TO_REPLACE = '<<random-heads-or-tails>>';
    public static DATA_RANDOM_SINGER_KEY_TO_REPLACE = '<<random-singer>>';
    public static DATA_RANDOM_SOUND_KEY_TO_REPLACE = '<<random-sound>>';
    public static DATA_RANDOM_SYNONYME_KEY_TO_REPLACE = '<<random-synonyme>>';

    constructor(private translate: TranslateService) {
    }

    /** Booléen indiquant que les langues sont chargées */
    private translationsLoaded: boolean;

    public areTranslationsLoaded(): boolean {
        return this.translationsLoaded;
    }

    public setTranslationsLoaded(translationsLoaded: boolean): void {
        this.translationsLoaded = translationsLoaded;
    }

    /**
     * Initialisation des constantes dépendants de la langue
     */
    public initLocalizedConstants(): void {
        this.translate.get('common.alcools.withPreposition').subscribe((str: string[]) => {LocalizedService.ALCOOLS_WITH_PREPOSITION = str});
        this.translate.get('common.alphabet.firstname').subscribe((str: string[]) => {LocalizedService.ALPHABET_FIRSTNAME = str});
        this.translate.get('common.alphabet.city').subscribe((str: string[]) => {LocalizedService.ALPHABET_CITY = str});
        this.translate.get('common.cards.color').subscribe((str: string[]) => {LocalizedService.CARDS_COLOR = str});
        this.translate.get('common.dishes.salted').subscribe((str: string[]) => {LocalizedService.DISHES_SALTED = str});
        this.translate.get('common.forbidden.verbs').subscribe((str: string[]) => {LocalizedService.FORBIDDEN_VERBS = str});
        this.translate.get('common.headsOrTails').subscribe((str: string[]) => {LocalizedService.HEADS_OR_TAILS = str});
        this.translate.get('common.singers').subscribe((str: string[]) => {LocalizedService.SINGERS = str});
        this.translate.get('common.sounds').subscribe((str: string[]) => {LocalizedService.SOUNDS = str});
        this.translate.get('common.synonymes').subscribe((str: string[]) => {LocalizedService.SYNONYMES = str});

        this.translate.get('common.player.suffix').subscribe((str: string) => {LocalizedService.PLAYER_SUFFIX = str;});
        this.translate.get('common.player.none').subscribe((str: string) => {LocalizedService.PLAYER_NONE = str;});
        this.translate.get('common.player.phoneOwner').subscribe((str: string) => {LocalizedService.PLAYER_PHONE_OWNER = str;});
        this.translate.get('common.player.younger').subscribe((str: string) => {LocalizedService.PLAYER_YOUNGER = str;});
        this.translate.get('common.player.older').subscribe((str: string) => {LocalizedService.PLAYER_OLDER = str;});
        this.translate.get('common.player.beardest').subscribe((str: string) => {LocalizedService.PLAYER_BEARDEST = str;});
        this.translate.get('common.player.designed').subscribe((str: string) => {LocalizedService.PLAYER_DESIGNED = str;});
        this.translate.get('common.player.first').subscribe((str: string) => {LocalizedService.PLAYER_FIRST = str;});
        this.translate.get('common.player.phoneHolder').subscribe((str: string) => {LocalizedService.PLAYER_PHONE_HOLDER = str;});
        this.translate.get('common.player.houseOwner').subscribe((str: string) => {LocalizedService.PLAYER_HOUSE_OWNER = str;});

        this.translate.get('common.command.drink.singular.indicative.second-person').subscribe((str: string) => {LocalizedService.DRINK_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND = str;});
        this.translate.get('common.command.drink.singular.indicative.third-person').subscribe((str: string) => {LocalizedService.DRINK_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND = str;});
        this.translate.get('common.command.drink.singular.imperative').subscribe((str: string) => {LocalizedService.DRINK_SINGULAR_IMPERATIVE_COMMAND = str;});
        this.translate.get('common.command.drink.plural').subscribe((str: string) => {LocalizedService.DRINK_PLURAL_COMMAND = str;});
        this.translate.get('common.command.give-out.singular.indicative.second-person').subscribe((str: string) => {LocalizedService.GIVE_OUT_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND = str;});
        this.translate.get('common.command.give-out.singular.indicative.third-person').subscribe((str: string) => {LocalizedService.GIVE_OUT_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND = str;});
        this.translate.get('common.command.give-out.singular.imperative').subscribe((str: string) => {LocalizedService.GIVE_OUT_SINGULAR_IMPERATIVE_COMMAND = str;});
        this.translate.get('common.command.give-out.plural').subscribe((str: string) => {LocalizedService.GIVE_OUT_PLURAL_COMMAND = str;});

        this.translate.get('common.sip.number.one').subscribe((str: string) => {LocalizedService.ONE_SIP_NUMBER = str;});
        this.translate.get('common.sip.number.two').subscribe((str: string) => {LocalizedService.TWO_SIP_NUMBER = str;});
        this.translate.get('common.sip.number.three').subscribe((str: string) => {LocalizedService.THREE_SIP_NUMBER = str;});
        this.translate.get('common.sip.number.four').subscribe((str: string) => {LocalizedService.FOUR_SIP_NUMBER = str;});
        this.translate.get('common.sip.number.five').subscribe((str: string) => {LocalizedService.FIVE_SIP_NUMBER = str;});
        this.translate.get('common.sip.suffix.singular').subscribe((str: string) => {LocalizedService.SIP_SUFFIX_SINGULAR = str;});
        this.translate.get('common.sip.suffix.plural').subscribe((str: string) => {LocalizedService.SIP_SUFFIX_PLURAL = str;});
        this.translate.get('common.sip.pronoun.singular').subscribe((str: string) => {LocalizedService.SIP_PRONOUN_SINGULAR = str;});
        this.translate.get('common.sip.pronoun.plural').subscribe((str: string) => {LocalizedService.SIP_PRONOUN_PLURAL = str;});
    }

    /**
     * Récupération du libellé d'un joueur
     * 
     * @param turnType 
     * @param player le joueur choisit au hasard (présent uniquement si des joueurs ont été renseignés)
     * 
     * @return le libellé d'un joueur
     */
    public static getPlayerLabel(turnType: TurnType, player?: Player): string {
        let playerLabel: string;

        if (player !== undefined) {
            // Le joueur est renseigné donc son nom est pris comme libellé de joueur
            playerLabel = player.name;
            if (turnType === TurnType.CONDITION || turnType === TurnType.GENERAL) {
                playerLabel +=  LocalizedService.PLAYER_SUFFIX;
            }
        } else {
            // Pas de joueur renseigné
            if (turnType === TurnType.CONDITION) {
                // Si condition: pas de libellé
                playerLabel = LocalizedService.PLAYER_NONE;
            } else {
                // Sinon : construction d'un tableau de libellé possible avec un poids attribué à chaque libellé
                const labels: ValueWithWeight<string>[] = [
                    new ValueWithWeight<string>(LocalizedService.PLAYER_PHONE_OWNER, 1),
                    new ValueWithWeight<string>(LocalizedService.PLAYER_YOUNGER, 1),
                    new ValueWithWeight<string>(LocalizedService.PLAYER_OLDER, 1),
                    new ValueWithWeight<string>(LocalizedService.PLAYER_BEARDEST, 1),
                    new ValueWithWeight<string>(LocalizedService.PLAYER_DESIGNED, 4),
                    new ValueWithWeight<string>(LocalizedService.PLAYER_FIRST, 4),
                    new ValueWithWeight<string>(LocalizedService.PLAYER_PHONE_HOLDER, 2),
                    new ValueWithWeight<string>(LocalizedService.PLAYER_HOUSE_OWNER, 1)
                ];

                return CommonService.getValueFromShuffledArrayWithWeight(labels);
            }
        }

        return playerLabel;
    }

    /**
     * Récupération du libellé d'un nombre de gorgées
     * 
     * @param sipNumber le nombre de gorgées
     * 
     * @return le libellé d'un nombre de gorgées
     */
    public static getSipNumberLabel(sipNumber: number): string {
        if (sipNumber === 0) {
            return LocalizedService.ONE_SIP_NUMBER;
        } else if (sipNumber === 1) {
            return LocalizedService.TWO_SIP_NUMBER;
        } else if (sipNumber === 2) {
            return LocalizedService.THREE_SIP_NUMBER;
        } else if (sipNumber === 3) {
            return LocalizedService.FOUR_SIP_NUMBER;
        } else if (sipNumber === 4) {
            return LocalizedService.FIVE_SIP_NUMBER;
        }
    }

    /**
     * Récupère le suffixe de "gorgée"
     * 
     * @return le suffixe de "gorgée"
     */
    public static getSipSuffix(sipNumber: number): string {
        return sipNumber > 1 ? LocalizedService.SIP_SUFFIX_PLURAL : LocalizedService.SIP_SUFFIX_SINGULAR;
    }

    /**
     * Récupère le pronom correspondant au nombre de gorgées (= la ou les)
     * 
     * @param sipNumber le nombre de gorgée
     * 
     * @return le pronom correspondant au nombre de gorgées
     */
    public static getSipPronoun(sipNumber: number): string {
        return sipNumber > 1 ? LocalizedService.SIP_PRONOUN_PLURAL : LocalizedService.SIP_PRONOUN_SINGULAR;
    }

    /**
     * Construit une copie des libellés donnés et y remplace les paramètres par des valeurs en relation avec le jeu
     * 
     * @param labels les libellés présentant des paramètres à remplacer
     * @param drink indique si l'action est de boire ou de distribuer
     * @param sipNumber le nombre de gorgées
     * @param playerLabel le libellé du joueur
     * @param secondPlayerLabel le libellé du joueur secondaire
     */
    public static replaceLabelsParameters(labels: string[], drink: boolean, sipNumber: number, playerLabel: string, secondPlayerLabel: string): string[] {
        const sipNumberLabel = LocalizedService.getSipNumberLabel(sipNumber);
        const sipSuffix = LocalizedService.getSipSuffix(sipNumber);
        const sipPronoun = LocalizedService.getSipPronoun(sipNumber);
        
        const randomAlcool = _.shuffle(LocalizedService.ALCOOLS_WITH_PREPOSITION)[0];
        const randomLetterFirstname = _.shuffle(LocalizedService.ALPHABET_FIRSTNAME)[0];
        const randomLetterCity = _.shuffle(LocalizedService.ALPHABET_CITY)[0];
        const randomCardColor = _.shuffle(LocalizedService.CARDS_COLOR)[0];
        const randomDishes = _.shuffle(LocalizedService.DISHES_SALTED);
        const randomFirstSaltedDish = CommonService.capitalize(randomDishes[0]);
        const randomSecondSaltedDish = randomDishes[1];
        const randomForbiddenVerb = _.shuffle(LocalizedService.FORBIDDEN_VERBS)[0];
        const randomHeadsOrTails = _.shuffle(LocalizedService.HEADS_OR_TAILS)[0];
        const randomSinger = _.shuffle(LocalizedService.SINGERS)[0];
        const randomSound = _.shuffle(LocalizedService.SOUNDS)[0];
        const randomSynonyme = _.shuffle(LocalizedService.SYNONYMES)[0];

        return labels.map(label => {
            return label
            .replace(LocalizedService.DATA_PLAYER_KEY_TO_REPLACE, playerLabel)
            .replace(LocalizedService.DATA_SECOND_PLAYER_KEY_TO_REPLACE, secondPlayerLabel)
            .replace(CommonService.getRegexFromKey(LocalizedService.DATA_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND_KEY_TO_REPLACE, true), CommonService.capitalize(drink ? LocalizedService.DRINK_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND : LocalizedService.GIVE_OUT_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND))
            .replace(CommonService.getRegexFromKey(LocalizedService.DATA_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND_KEY_TO_REPLACE), drink ? LocalizedService.DRINK_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND : LocalizedService.GIVE_OUT_SINGULAR_INDICATIVE_SECOND_PERSON_COMMAND)
            .replace(CommonService.getRegexFromKey(LocalizedService.DATA_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND_KEY_TO_REPLACE, true), CommonService.capitalize(drink ? LocalizedService.DRINK_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND : LocalizedService.GIVE_OUT_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND))
            .replace(CommonService.getRegexFromKey(LocalizedService.DATA_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND_KEY_TO_REPLACE), drink ? LocalizedService.DRINK_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND : LocalizedService.GIVE_OUT_SINGULAR_INDICATIVE_THIRD_PERSON_COMMAND)
            .replace(CommonService.getRegexFromKey(LocalizedService.DATA_SINGULAR_IMPERATIVE_COMMAND_KEY_TO_REPLACE, true), CommonService.capitalize(drink ? LocalizedService.DRINK_SINGULAR_IMPERATIVE_COMMAND : LocalizedService.GIVE_OUT_SINGULAR_IMPERATIVE_COMMAND))
            .replace(CommonService.getRegexFromKey(LocalizedService.DATA_SINGULAR_IMPERATIVE_COMMAND_KEY_TO_REPLACE), drink ? LocalizedService.DRINK_SINGULAR_IMPERATIVE_COMMAND : LocalizedService.GIVE_OUT_SINGULAR_IMPERATIVE_COMMAND)
            .replace(CommonService.getRegexFromKey(LocalizedService.DATA_PLURAL_COMMAND_KEY_TO_REPLACE, true), CommonService.capitalize(drink ? LocalizedService.DRINK_PLURAL_COMMAND : LocalizedService.GIVE_OUT_PLURAL_COMMAND))
            .replace(CommonService.getRegexFromKey(LocalizedService.DATA_PLURAL_COMMAND_KEY_TO_REPLACE), drink ? LocalizedService.DRINK_PLURAL_COMMAND : LocalizedService.GIVE_OUT_PLURAL_COMMAND)
            .replace(LocalizedService.DATA_SIP_NUMBER_KEY_TO_REPLACE, sipNumberLabel)
            .replace(LocalizedService.DATA_SIP_SUFFIX_KEY_TO_REPLACE, sipSuffix)
            .replace(LocalizedService.DATA_SIP_PRONOUN_KEY_TO_REPLACE, sipPronoun)
            .replace(LocalizedService.DATA_RANDOM_ALCOOL_KEY_TO_REPLACE, randomAlcool)
            .replace(LocalizedService.DATA_RANDOM_LETTER_FIRSTNAME_KEY_TO_REPLACE, randomLetterFirstname.toUpperCase())
            .replace(LocalizedService.DATA_RANDOM_LETTER_CITY_KEY_TO_REPLACE, randomLetterCity.toUpperCase())
            .replace(LocalizedService.DATA_RANDOM_CARD_COLOR_KEY_TO_REPLACE, randomCardColor)
            .replace(LocalizedService.DATA_RANDOM_FIRST_DISH_SALTED_KEY_TO_REPLACE, randomFirstSaltedDish)
            .replace(LocalizedService.DATA_RANDOM_SECOND_DISH_SALTED_KEY_TO_REPLACE, randomSecondSaltedDish)
            .replace(LocalizedService.DATA_RANDOM_FORBIDDEN_VERBS_KEY_TO_REPLACE, randomForbiddenVerb)
            .replace(LocalizedService.DATA_RANDOM_HEADS_OR_TAILS_VERBS_KEY_TO_REPLACE, randomHeadsOrTails)
            .replace(LocalizedService.DATA_RANDOM_SINGER_KEY_TO_REPLACE, randomSinger)
            .replace(LocalizedService.DATA_RANDOM_SOUND_KEY_TO_REPLACE, randomSound)
            .replace(LocalizedService.DATA_RANDOM_SYNONYME_KEY_TO_REPLACE, randomSynonyme);
        });
    }
}
