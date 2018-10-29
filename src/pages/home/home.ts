import { animate, Component, ElementRef, OnInit, state, style, transition, trigger, ViewChild } from '@angular/core';
import { AppRate } from '@ionic-native/app-rate';
import { Modal, ModalController, NavController } from 'ionic-angular';
import { Player } from '../../app/entities';
import { LocalizedService } from '../../app/_services/localized.service';
import { PlayerService } from '../../app/_services/player.service';
import { TurnEntryService } from '../../app/_services/turnEntry.service';
import { environment as ENV } from '../../environments/environment';
import { PlayPage } from '../play/play';
import { PreferencesPage } from '../preferences/preferences';
import { WarningPage } from '../warning/warning';

/**
 * Page d'accueil
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
          trigger('rotatedState', [
            state('default', style({ transform: 'rotate(0deg)' })),
            state('rotated', style({ transform: 'rotate(90deg)' })),
            transition('* => *', animate('0.4s ease-out')),
        ])
    ]
})
export class HomePage implements OnInit {

  /** Element graphique des joueurs */
  @ViewChild('playersListContainer')
  playersListContainer: ElementRef;

  @ViewChild('lastPlayerName')
  lastPlayerName: ElementRef;

  public consent: boolean = false;

  /** Position de la rotation du bouton d'ajout d'un joueur */
  public addButtonRotatedPosition: number = 0;
  /** Tableau des états de rotations possibles pour le bouton d'ajout d'un joueur */
  public rotated = ['default', 'rotated'];

  /** Tableau des joueurs */
  public players: Player[] = [
    new Player(),
    new Player(),
    new Player()
  ];

  /** Booléen indiquant si une partie est en cours de lancement */
  public playIsLoading: boolean = false;

  constructor(public navCtrl: NavController, private modalCtrl: ModalController, private appRate: AppRate, 
                private localizedService: LocalizedService, private turnEntryService: TurnEntryService, private playerService: PlayerService) {
    // Construction de la page d'avertissement et affichage
    const modal: Modal = this.modalCtrl.create(WarningPage);

    modal.present()
      .then(() => {
        this.consent = true;
        this.loadStoredPlayers();
      });
  }
  
  /**
   * Méthode appelée après initialisation du composant
   */
  ngOnInit() {}

  /**
   * Vérifie si les traductions sont chargées
   * 
   * @return un booléen indiquant si les traductions sont chargées
   */
  public areTranslationsLoaded(): boolean {
    return this.localizedService.areTranslationsLoaded();
  }

  /**
   * Chargement des joueurs stockés en cache
   */
  private loadStoredPlayers() {
    this.playerService.getSavedPlayersOnStorage()
      .then((playersOnStorage: Player[]) => {
        const players: Player[] = playersOnStorage;
        while (players.length < ENV.MIN_PLAYERS_ON_DISPLAY) {
          players.push(new Player());
        }

        this.players = players;
      })
      .catch(error => {
        console.log(error);
      });
  }

  /**
   * Vérifie si un joueur peut encore être ajouté
   * 
   * @return un booléen indiquant si un joueur peut encore être ajouté
   */
  public canAddPlayer(): boolean {
    return this.players.length < ENV.PLAYERS_MAX_NUMBER;
  }

  focusInput(input) {
    input.setFocus();
  }

  /**
   * Ajout d'un joueur
   */
  public addPlayer() {
    if (this.canAddPlayer()) {
      this.addButtonRotatedPosition = (this.addButtonRotatedPosition + 1) % this.rotated.length;

      this.players.push(new Player());

      // Focus sur le dernier input
      setTimeout(() => {
        // (<any> this.lastPlayerName).setFocus();

        // C'est très moche mais permet de faire scroller la liste des joueurs vers le bas
        (<any> this.playersListContainer)._scrollContent.nativeElement.scrollTop = (<any> this.playersListContainer)._scrollContent.nativeElement.scrollHeight + 75;
      }, 1);
    }
  }

  /**
   * Indique si un jeu peut être lancé
   * 
   * @return un booléen indiquant si un jeu peut être lancé
   */
  public canLaunchPlay(): boolean {
    return this.turnEntryService.dataLoaded && !this.playIsLoading;
  }

  /**
   * Ouverture de la page d'un jeu
   */
  public onPlayClick(): void {
    if (!this.playIsLoading) {
      this.playIsLoading = true;

      this.playerService.setPlayers(this.players);
      this.playerService.savePlayersOnStorage(this.players);
  
      this.navCtrl.push(PlayPage);

      this.playIsLoading = false;
    }
  }

  /**
   * Ouverture de la page de gestion des préférences
   */
  public onPreferencesClick() {
    // Affichage de la page des préférences
    this.navCtrl.push(PreferencesPage);
  }

  /**
   * Ouverture de la page de l'application pour la noter
   */
  public onRatingClick() {
    if (!ENV.DEV) {
      this.appRate.promptForRating(true);
    }
  }
}
