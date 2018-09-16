import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Player } from '../../app/entities';
import { PlayerService } from '../../app/_services/player.service';
import { PlayPage } from '../play/play';
import { WarningPage } from '../warning/warning';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

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
      this.players.push(new Player());
    }
  }

  public onPlayClick() {
    this.playerService.setPlayers(this.players);
    this.playerService.savePlayersOnStorage(this.players);

    this.navCtrl.push(PlayPage);
  }
}
