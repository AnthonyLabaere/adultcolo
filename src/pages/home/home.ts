import { animate, Component, OnInit, state, style, transition, trigger } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { Player } from '../../app/entities';
import { PlayerService } from '../../app/_services/player.service';
import { PlayPage } from '../play/play';
import { WarningPage } from '../warning/warning';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
          // Each unique animation requires its own trigger. The first argument of the trigger function is the name
          trigger('rotatedState', [
            state('default', style({ transform: 'rotate(0deg)' })),
            state('rotated', style({ transform: 'rotate(90deg)' })),
            transition('* => *', animate('0.4s ease-out')),
        ])
    ]
})
export class HomePage implements OnInit {

  public addButtonRotatedPosition: number = 0;
  public rotated = ['default', 'rotated'];

  private static MIN_PLAYERS_ON_DISPLAY = 3;

  public players: Player[] = [
    new Player(),
    new Player(),
    new Player()
  ];

  constructor(public navCtrl: NavController, private modalCtrl: ModalController, private playerService: PlayerService) {
    this.modalCtrl.create(WarningPage).present();
  }
  
  ngOnInit() {
    this.loadStoredPlayers();
  }

  private loadStoredPlayers() {
    this.playerService.getSavedPlayersOnStorage()
      .then((playersOnStorage: Player[]) => {
        const players: Player[] = playersOnStorage;
        while (players.length < HomePage.MIN_PLAYERS_ON_DISPLAY) {
          players.push(new Player());
        }

        this.players = players;
      })
      .catch(error => {
        console.log(error);
      });
  }

  public canAddPlayer() {
    return this.players.length < PlayerService.PLAYERS_MAX_NUMBER;
  }

  public addPlayer() {
    if (this.canAddPlayer()) {
      this.addButtonRotatedPosition = (this.addButtonRotatedPosition + 1) % this.rotated.length;

      this.players.push(new Player());
    }
  }

  public onPlayClick() {
    this.playerService.setPlayers(this.players);
    this.playerService.savePlayersOnStorage(this.players);

    this.navCtrl.push(PlayPage);
  }
}
