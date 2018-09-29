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

  // Liste des tours (= slides) de jeu
  private turns: Turn[] = [];
  // Liste des tours (de type longue haleine) de jeu
  private longWindedTurns: Turn[] = [];
  // Index du tour de jeu en cours
  private index: number;

  // Indexes des tours de longue haleine
  private longWindedIndexes: number[];

  // Index de la sous-slide dans le tour de jeu en cours (les tours peuvent avoir plusieurs niveaux)
  public currentTurnLabelIndex: number;

  // Dans le cas où un timer est nécessaire (exemple : les chansons)
  public timer: Timer;

  constructor(public navCtrl: NavController, private playerService: PlayerService, private playService: PlayService) {
    this.playService.getTurns()
      .then((turns: Turn[]) => {
        this.turns = turns;

        return this.playService.getLongWindedTurns();
      })
      .then((longWindedTurns: Turn[]) => {
        this.longWindedTurns = longWindedTurns;

        this.startPlay();
      });
  }

  public startPlay() {
    this.index = 0;
    this.onTurnChange();
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

  public showTitle(turnType: TurnType): boolean {
    return CommonService.showTitle(turnType);
  }

  public showDescription(turnType: TurnType): boolean {
    return CommonService.showDescription(turnType);
  }

}
