import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Turn } from '../../app/entities';
import { PlayService } from './play.service';

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {

  private turns: Turn[] = [];
  private index: number = 0;

  constructor(public navCtrl: NavController, private playService: PlayService) {
    this.index = 0;
    
    this.playService.getTurns()
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
      this.navCtrl.pop();
    }
  }
}
