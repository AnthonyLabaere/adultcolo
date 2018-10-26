import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Preference } from '../../app/entities';
import { TurnTypeService } from '../../app/_services/turnType.service';

/**
 * Page des préférences
 */
@Component({
  selector: 'page-preferences',
  templateUrl: 'preferences.html'
})
export class PreferencesPage implements OnInit {

  /** Listes des préférences modifiables dans la page */
  public preferences: Preference[] = [];

  constructor(private navCtrl: NavController, private turnTypeService: TurnTypeService) {
  }

  /**
   * Méthode appelée après initialisation du composant
   */
  ngOnInit() {
      // Type de jeux dont le nombre d'apparitions peut être modifié
      this.turnTypeService.getQuestionTurnTypes().forEach(turnType => {
        this.preferences.push(new Preference(turnType, this.turnTypeService.getDefaultPreference(turnType)));
      });
  }

  /**
   * Méthode de fermeture de l'application
   */
  onCloseClick() {
    this.navCtrl.pop();
  }
}
