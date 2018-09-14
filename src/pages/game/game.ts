import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { GameService } from './game.service';

@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})
export class GamePage {

  public turns: string[] = [];
  public turnIndex: number = 0;

  constructor(public navCtrl: NavController, private gameService: GameService) {
    this.turnIndex = 0;
    
    this.gameService.getTurns()
      .then((turns: string[]) => {
        this.turns = turns;
      });
  }

  public onContentClick() {
    if (this.turnIndex < this.turns.length - 1) {
      this.turnIndex++;
    } else {
      this.navCtrl.push(HomePage);
    }
  }
}
