export const environment = {
    DEV: true,

    ADULTCOLO_STORAGE_KEY_PREFIX: 'adultcolo-',
    PLAYER_STORAGE_KEY_PREFIX: 'adultcolo-player',

    MIN_PLAYERS_ON_DISPLAY: 3,
    PLAYERS_MIN_NUMBER: 2,
    PLAYERS_MAX_NUMBER: 50,

    SIP_NUMBER: [0, 2],
    BIG_SIP_NUMBER: [1, 3],

    TURN_NUMBER_TOTAL: 10,
    ADS_BY_PLAY: [0, 0],
    CARTOONS_BY_PLAY: [0, 0],
    FOR_OR_AGAINSTS_BY_PLAY: [0, 0],
    GAMES_BY_PLAY: [0, 0],
    GENERALS_BY_PLAY: [0, 0],
    INSTEADS_BY_PLAY: [1, 1],
    LISTS_BY_PLAY: [0, 0],
    LONG_WINDEDS_BY_PLAY: [0, 0],
    MOVIES_BY_PLAY: [0, 0],
    SONGS_BY_PLAY: [0, 0],

    MIN_TURNS_AFTER_LONG_WINDED_END:  5,
    MAX_PERCENT_TURNS_BEFORE_ANY_LONG_WINDED_TURN:  0.75,
    
    AD_PARAMETERS: [true, true, true],
    CARTOON_PARAMETERS: [true, true, true],
    CONDITION_PARAMETERS: [false, false, false],
    FOR_OR_AGAINST_PARAMETERS: [true, true, false],
    GAME_PARAMETERS: [true, false, false],
    GENERAL_PARAMETERS: [false, false, false],
    INSTEAD_PARAMETERS: [true, true, false],
    LIST_PARAMETERS: [true, true, false],
    LONG_WINDED_PARAMETERS: [false, false, false],
    MOVIE_PARAMETERS: [true, true, true],
    SONG_PARAMETERS: [true, true, true],

    TIMER_DEFAULT_TIME: 10,
    TIMER_GAME_TIME: 10,
    TIMER_INTERVAL_IN_MILLI_SECONDS: 10,

    PACKAGE_NAME: '',
    ADMOB_INTERSTITIAL_KEY: ''
}