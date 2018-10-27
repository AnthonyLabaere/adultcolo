export const environment = {
    // Indique si la version est une version de dev
    DEV: true,

    // Indique si les publicités doivent être affichées
    DISPLAY_AD: false,

    // Préfixe de clé de sauvegarde dans le cache pour l'application
    ADULTCOLO_STORAGE_KEY_PREFIX: 'adultcolo-',
    // Préfixe de clé de sauvegarde dans le cache pour un joueur
    PLAYER_STORAGE_KEY_PREFIX: 'adultcolo-player',
    // Préfixe de clé de sauvegarde dans le cache pour une valeur de préférence
    PREFERENCE_STORAGE_KEY_PREFIX: 'adultcolo-preference',

    // Nombre minimum de joueur à afficher sur la page d'accueil
    MIN_PLAYERS_ON_DISPLAY: 3,
    // Nombre minimum de joueur pour lancer une partie du type "avec joueurs renseignés"
    PLAYERS_MIN_NUMBER: 2,
    // Nombre max de joueurs
    PLAYERS_MAX_NUMBER: 50,

    // Nombre [min, max] de gorgées à boire
    SIP_NUMBER: [1, 3],
    BIG_SIP_NUMBER: [2, 4],

    // Nombre total de tour de jeu (utilisé pour alimenter en "Condition")
    TURN_NUMBER_TOTAL: 30,
    // Nombres [min, max] du total de tour de jeu de type question
    QUESTION_TURN_NUMBER_TOTAL_BY_PLAY: [5, 7],
    // Nombres [min, max] de chaque type de tours
    FOR_OR_AGAINSTS_BY_PLAY: [1, 3],
    GAMES_BY_PLAY: [5, 7],
    GENERALS_BY_PLAY: [2, 4],
    INSTEADS_BY_PLAY: [1, 3],
    LISTS_BY_PLAY: [1, 3],
    LONG_WINDEDS_BY_PLAY: [2, 4],

    // Nombre de tour minimum avant de pouvoir réafficher le deuxième élément d'un tour du type "De longue haleine"
    MIN_TURNS_AFTER_LONG_WINDED_END:  5,
    // Pourcentage max de calcul dans les tours de jeu (0.5 = la moitié des tours) avant lequel tout les tours du type "De longue haleine" doivent avoir commencés
    MAX_PERCENT_TURNS_BEFORE_ANY_LONG_WINDED_TURN:  0.75,
    
    // Paramètres [preference, isQuestion, withTitle, withDescription, withTimer] des tours de jeu par type
    AD_PARAMETERS:             [true, true, true, true, true],
    CARTOON_PARAMETERS:        [true, true, true, true, true],
    CONDITION_PARAMETERS:      [true, false, false, false, false],
    FOR_OR_AGAINST_PARAMETERS: [true, false, true, true, false],
    GAME_PARAMETERS:           [true, false, true, false, false],
    GENERAL_PARAMETERS:        [true, false, false, false, false],
    INSTEAD_PARAMETERS:        [true, false, true, true, false],
    LIST_PARAMETERS:           [true, false, true, true, false],
    LONG_WINDED_PARAMETERS:    [true, false, false, false, false],
    MOVIE_PARAMETERS:          [true, true, true, true, true],
    SONG_PARAMETERS:           [true, true, true, true, true],

    // Temps par défaut du minuteur
    TIMER_DEFAULT_TIME: 10,
    // Temps du minuteur pour un jeu
    TIMER_GAME_TIME: 10,
    // Interval technique de rafraîchissement graphique du minuteur
    TIMER_INTERVAL_IN_MILLI_SECONDS: 10,

    // Nom du package Android de l'application
    PACKAGE_NAME: '',
    // Clé ADMOB pour les publicités
    ADMOB_INTERSTITIAL_KEY: ''
}