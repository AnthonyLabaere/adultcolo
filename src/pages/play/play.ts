import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Timer, Turn, TurnType } from '../../app/entities';
import { CommonService } from '../../app/_services/common.service';
import { PlayerService } from '../../app/_services/player.service';
import { PlayService } from './play.service';
import { AdMobFree, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';
import { environment as ENV } from '../../environments/environment';

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

  constructor(public navCtrl: NavController, private admobFree: AdMobFree, private playerService: PlayerService, private playService: PlayService) {

    if (!ENV.DEV) {
      const interstitialConfig: AdMobFreeInterstitialConfig = {
        isTesting: ENV.DEV,
        autoShow: false
      };
      if (!ENV.DEV) {
        interstitialConfig.id = ENV.ADMOB_INTERSTITIAL_KEY;
      }
      this.admobFree.interstitial.config(interstitialConfig);
      // On considère qu'il est inutile de retourner la promesse : l'action sera terminée lorsque la pub devra être affichée
      this.admobFree.interstitial.prepare();
    }

    this.playService.getTurns()
      .then((turns: Turn[]) => {
        this.turns = turns;
        this.startPlay();
      });
  }

  /**
   * Lancement de la partie
   */
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
        // Fin de la partie : petite publicité
        if (ENV.DEV) {
          this.navCtrl.pop();
        } else {
          this.admobFree.interstitial.show()
            .then(() => {
              // Puis on retourne à l'écran d'accueil
              this.navCtrl.pop();
            });
        }
      }
    }
  }

  private onTurnChange() {
    this.currentTurnLabelIndex = 0;

    if (CommonService.showTimer(this.getCurrentTurn().type) || this.getCurrentTurn().withTimer) {
      this.timer = new Timer(this.playerService.hasEnoughtPlayers());
      this.timer.start(this.onContentClick.bind(this));
    }
  }

  public showTitle(turnType: TurnType): boolean {
    if (turnType !== undefined && turnType !== null) {
      return CommonService.showTitle(turnType);
    } else {
      return false;
    }
  }

  public showDescription(turnType: TurnType): boolean {
    if (turnType !== undefined && turnType !== null) {
      return CommonService.showDescription(turnType);
    } else {
      return false;
    }
  }

}
