import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Timer, Turn, TurnType } from '../../app/entities';
import { CommonService } from '../../app/_services/common.service';
import { PlayerService } from '../../app/_services/player.service';
import { PlayService } from './play.service';

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {

  // Liste des tours (= slides) de jeu
  private turns: Turn[] = [];
  // Index du tour de jeu en cours
  private index: number;

  // Index de la sous-slide dans le tour de jeu en cours (les tours peuvent avoir plusieurs niveaux)
  public currentTurnLabelIndex: number;

  // Dans le cas où un timer est nécessaire (exemple : les chansons)
  public timer: Timer;

  constructor(public navCtrl: NavController, private playerService: PlayerService, private playService: PlayService) {
    this.playService.getTurns()
      .then((turns: Turn[]) => {
        this.turns = turns;
        this.startPlay();
      });
  }

  private startPlay() {
    this.index = 0;
    this.onTurnChange();
  }

  public getCurrentTurn() {
    return this.turns[this.index];
  }

  public onContentClick() {
    if (this.timer !== undefined && this.timer.timeInMilliSecondsLeft > 0) {
      // Si un clic est effectué un timer, on considère que l'utilisateur a trouvé la réponse et on arrête le timer
      this.timer.stop();
    }
    
    this.timer = undefined;

    if (this.currentTurnLabelIndex < this.getCurrentTurn().labels.length - 1) {
      // Le tour de jeu est en plusieurs slides : passage à la suivante
      this.currentTurnLabelIndex++;
    } else {
      if (this.index < this.turns.length - 1) {
        // Passage au tour de jeu suivant
        this.index++;
        this.onTurnChange();
      } else {
        // Fin de la partie : on retourne à l'écran d'accueil
        // TODO : ajouter ici une page de pub
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
