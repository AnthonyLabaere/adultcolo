import { Component } from '@angular/core';
import { AdMobFree, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';
import { Insomnia } from '@ionic-native/insomnia';
import { NavController } from 'ionic-angular';
import { Timer, Turn, TurnType } from '../../app/entities';
import { CommonService } from '../../app/_services/common.service';
import { LocalizedService } from '../../app/_services/localized.service';
import { environment as ENV } from '../../environments/environment';
import { PlayService } from './play.service';

/**
 * Page d'une partie de jeu
 */
@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {

  public turnTransition: boolean = false;

  /** Liste des tours (= slides) de jeu */
  private turns: Turn[] = [];
  /** Index du tour de jeu en cours */
  private index: number;

  /** Index de la sous-slide dans le tour de jeu en cours (les tours peuvent avoir plusieurs niveaux) */
  public currentTurnLabelIndex: number;

  /** Dans le cas où un timer est nécessaire (exemple : les chansons) */
  public timer: Timer;

  constructor(public navCtrl: NavController, private insomnia: Insomnia, private admobFree: AdMobFree, 
      private commonService: CommonService, private playService: PlayService) {
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

    // Récupération des tours
    this.playService.getTurns()
      .then((turns: Turn[]) => {
        this.turns = turns;
        // Lancement de la partie
        this.startPlay();
      });
  }

  /**
   * Lancement de la partie
   */
  private startPlay() {
    if (!ENV.DEV) {
      // Interdiction de passer en mode veille
      this.insomnia.keepAwake()
        .then(
          () => {},
          () => {}
        );
    }

    this.index = 0;
    this.onTurnChange();
  }

  public getCurrentTurn() {
    return this.turns[this.index];
  }

  public onContentClick() {
    if (this.timer !== undefined && this.timer.timeInMilliSecondsLeft > 0 && !this.timer.started) {
      // Clic effectué sur le timer en attente : démarrage du timer
      this.timer.start(this.onContentClick.bind(this));
    } else {
      if (this.timer !== undefined && this.timer.timeInMilliSecondsLeft > 0) {
        // Clic effectué avec un timer en cours (= réponse trouvée) : arrêt du timer
        this.timer.stop();
      }

      this.timer = undefined;

      if (this.currentTurnLabelIndex < this.getCurrentTurn().labels.length - 1) {
        // Le tour de jeu est en plusieurs slides : passage à la suivante
        this.currentTurnLabelIndex++;
      } else {
        if (this.index < this.turns.length - 1) {
          // Passage au tour de jeu suivant
          this.turnTransition = true;
          this.index++;
          this.onTurnChange();

          // C'est dégueu mais ça permet de gérer les animations
          setTimeout(() => {this.turnTransition = false;}, 1);
        } else {
          // Fin de la partie : petite publicité
          if (ENV.DEV) {
            this.navCtrl.pop();
          } else {
            let showAdPromise;
            if (ENV.DISPLAY_AD) {
              showAdPromise = this.admobFree.interstitial.show();
            } else {
              showAdPromise = Promise.resolve();
            }

            showAdPromise
              .then(() => {
                if (!ENV.DEV) {
                  // La mise en veille est de nouveau rendu possible
                  this.insomnia.allowSleepAgain()
                    .then(
                      () => {},
                      () => {}
                    );
                }
                // Puis on retourne à l'écran d'accueil
                this.navCtrl.pop();
              });
          }
        }
      }
    }
  }

  /**
   * Méthode appelée après un changement de tour
   */
  private onTurnChange(): void {
    // Le sous-index du tour est remis à 0
    this.currentTurnLabelIndex = 0;

    // Affichage du timer si besoin
    if (this.commonService.showTimer(this.getCurrentTurn().type) || this.getCurrentTurn().withTimer) {
      this.timer = new Timer(this.getCurrentTurn().type);
    }
  }

  /**
   * Indique si un titre global doit être affiché pour un type de tour donné
   * 
   * @param turnType le type de tour
   * 
   * @return un booléen indiquant si un titre global doit être affiché pour le type de tour
   */
  public showGlobalTitle(turnType: TurnType): boolean {
    if (turnType !== undefined && turnType !== null) {
      return this.commonService.showTitle(turnType);
    } else {
      return false;
    }
  }

  /**
   * Indique si un titre spécifique doit être affiché
   * 
   * @return un booléen indiquant si un titre spécifique doit être affiché
   */
  public showSpecificTitle(): boolean {
    if (this.getCurrentTurn() !== undefined 
          && this.getCurrentTurn().titles !== undefined 
          && (this.getCurrentTurn().titles.length - 1) >= this.currentTurnLabelIndex) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Indique si une description globale doit être affichée pour un type de tour donné
   * 
   * @param turnType le type de tour
   * 
   * @return un booléen indiquant si une description globale doit être affichée pour le type de tour
   */
  public showGlobalDescription(turnType: TurnType): boolean {
    if (turnType !== undefined && turnType !== null) {
      return this.commonService.showDescription(turnType);
    } else {
      return false;
    }
  }

  /**
   * Indique si une description spécifique doit être affiché
   * 
   * @return un booléen indiquant si une description spécifique doit être affichée
   */
  public showSpecificDescription(): boolean {
    if (this.getCurrentTurn() !== undefined 
          && this.getCurrentTurn().descriptions !== undefined 
          && (this.getCurrentTurn().descriptions.length - 1) >= this.currentTurnLabelIndex) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Libellé du nombre de gorgées
   * 
   * @return le libellé du nombre de gorgées
   */
  public getSipNumberLabel(): string {
    if (this.getCurrentTurn()) {
      return LocalizedService.getSipNumberLabel(this.getCurrentTurn().sipNumber);
    } else {
      return '';
    }
  }

  /**
   * Suffixe du nombre de gorgées
   * 
   * @return le suffixe du nombre de gorgées
   */
  public getSipSuffix(): string {
    if (this.getCurrentTurn()) {
      return LocalizedService.getSipSuffix(this.getCurrentTurn().sipNumber);
    } else {
      return '';
    }
  }

  /**
   * Pronom du nombre de gorgées
   * 
   * @return le pronom du nombre de gorgées
   */
  public getSipPronoun(): string {
    if (this.getCurrentTurn()) {
      return LocalizedService.getSipPronoun(this.getCurrentTurn().sipNumber);
    } else {
      return '';
    }
  }

}
