import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GamePage } from '../game/game';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  public players: string[];

  constructor(public navCtrl: NavController) {

  }
  
  ngOnInit() {
    this.players = [];
    for (let i = 0; i < 3; i++) {
      this.players.push('');
    }
  }

  public onPlayClick() {
    this.navCtrl.push(GamePage);
  }

}
