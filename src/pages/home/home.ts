import { animate, Component, ElementRef, OnInit, state, style, transition, trigger, ViewChild } from '@angular/core';
import { AppRate } from '@ionic-native/app-rate';
import { ModalController, NavController } from 'ionic-angular';
import { Player } from '../../app/entities';
import { PlayerService } from '../../app/_services/player.service';
import { environment as ENV } from '../../environments/environment';
import { PlayPage } from '../play/play';
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

  /** Position de la rotation du bouton d'ajout d'un joueur */
  public addButtonRotatedPosition: number = 0;
  /** Tableau des états de rotations possibles pour le bouton d'ajout d'un joueur */
  public rotated = ['default', 'rotated'];

  public players: Player[] = [
    new Player(),
    new Player(),
    new Player()
  ];

  constructor(public navCtrl: NavController, private modalCtrl: ModalController, private appRate: AppRate, private playerService: PlayerService) {
    // Construction de la page d'avertissement et affichage
    this.modalCtrl.create(WarningPage).present();
  }
  
  ngOnInit() {
    this.loadStoredPlayers();
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

  /**
   * Ajout d'un joueur
   */
  public addPlayer() {
    if (this.canAddPlayer()) {
      this.addButtonRotatedPosition = (this.addButtonRotatedPosition + 1) % this.rotated.length;

      this.players.push(new Player());

      // C'est moche mais permet de faire scroller la liste des joueurs vers le bas
      (<any> this.playersListContainer)._scrollContent.nativeElement.scrollTop = (<any> this.playersListContainer)._scrollContent.nativeElement.scrollHeight;
    }
  }

  /**
   * Ouverture de la page d'un jeu
   */
  public onPlayClick() {
    this.playerService.setPlayers(this.players);
    this.playerService.savePlayersOnStorage(this.players);

    this.navCtrl.push(PlayPage);
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
