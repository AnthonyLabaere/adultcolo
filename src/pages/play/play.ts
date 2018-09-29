import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Turn, TurnType, Timer } from '../../app/entities';
import { CommonService } from '../../app/_services/common.service';
import { PlayService } from './play.service';
import { PlayerService } from '../../app/_services/player.service';

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {

  private turns: Turn[] = [];
  private index: number;

  public currentTurnLabelIndex: number;

  public timer: Timer;

  constructor(public navCtrl: NavController, private playerService: PlayerService, private playService: PlayService) {
    
    this.playService.getTurns()
      .then((turns: Turn[]) => {
        this.turns = turns;

        this.index = 0;
        this.onTurnChange();
      });
  }

  public showTitle(turnType: TurnType): boolean {
    return CommonService.showTitle(turnType);
  }

  public showDescription(turnType: TurnType): boolean {
    return CommonService.showDescription(turnType);
  }

  public getCurrentTurn() {
    return this.turns[this.index];
  }

  public onContentClick() {
    if (this.timer !== undefined && this.timer.timeInMilliSecondsLeft > 0) {
      this.timer.stop();
    }
    
    this.timer = undefined;

    if (this.currentTurnLabelIndex < this.getCurrentTurn().labels.length - 1) {
      this.currentTurnLabelIndex++;
    } else {
      if (this.index < this.turns.length - 1) {
        this.index++;
        this.onTurnChange();
      } else {
        this.navCtrl.pop();
      }
    }
  }

  private onTurnChange() {
    this.currentTurnLabelIndex = 0;

    if (CommonService.withTimer(this.getCurrentTurn().type)) {
      this.timer = new Timer(this.playerService.hasEnoughtPlayers());
      this.timer.start(this.onContentClick.bind(this));
    }
  }

}
