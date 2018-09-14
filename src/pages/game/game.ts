import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Turn } from '../../app/entities';
import { HomePage } from '../home/home';
import { GameService } from './game.service';

@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})
export class GamePage {

  private turns: Turn[] = [];
  private index: number = 0;

  constructor(public navCtrl: NavController, private gameService: GameService) {
    this.index = 0;
    
    this.gameService.getTurns()
      .then((turns: Turn[]) => {
        this.turns = turns;
      });
  }

  public getCurrentTurn() {
    return this.turns[this.index];
  }

  public onContentClick() {
    if (this.index < this.turns.length - 1) {
      this.index++;
    } else {
      this.navCtrl.push(HomePage);
    }
  }
}
