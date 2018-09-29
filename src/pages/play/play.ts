import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Turn, TurnType } from '../../app/entities';
import { PlayService } from './play.service';
import { CommonService } from '../../app/_services/common.service';

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {

  // TODO : mettre en place deux tableaux de booléen permettant de préciser si les titres ou descriptions des différents types de tour doivent être récupéré

  private turns: Turn[] = [];
  private index: number = 0;

  public currentTurnLabelIndex: number = 0;

  constructor(public navCtrl: NavController, private commonService: CommonService, private playService: PlayService) {
    this.index = 0;
    
    this.playService.getTurns()
      .then((turns: Turn[]) => {
        this.turns = turns;
      });
  }

  public showTitle(turnType: TurnType): boolean {
    return this.commonService.showTitle(turnType);
  }

  public showDescription(turnType: TurnType): boolean {
    return this.commonService.showDescription(turnType);
  }

  public getCurrentTurn() {
    return this.turns[this.index];
  }

  public onContentClick() {
    if (this.currentTurnLabelIndex < this.getCurrentTurn().labels.length - 1) {
      this.currentTurnLabelIndex++;
    } else {
      if (this.index < this.turns.length - 1) {
        this.index++;
        this.currentTurnLabelIndex = 0;
      } else {
        this.navCtrl.pop();
      }
    }
  }
}
