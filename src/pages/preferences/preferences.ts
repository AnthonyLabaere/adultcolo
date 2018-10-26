import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Preference, TurnType } from '../../app/entities';
import { TurnTypeService } from '../../app/_services/turnType.service';
import { PreferenceService } from './preferences.service';

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

  constructor(private navCtrl: NavController, private turnTypeService: TurnTypeService, private preferenceService: PreferenceService) {
  }

  /**
   * Méthode appelée après initialisation du composant
   */
  ngOnInit() {
      // Type de jeux dont le nombre d'apparitions peut être modifié
      this.turnTypeService.getQuestionTurnTypes().forEach(turnType => {
        this.preferenceService.getPreferenceValue(turnType)
          .then((preferenceValue: boolean) => {
            this.preferences.push(new Preference(turnType, preferenceValue));
          });
      });
  }

  /**
   * Méthode appelée après un clic sur une préférence
   */
  onPreferenceClick(preference: Preference) {
    preference.value = !preference.value;

    this.onPreferenceChange(preference);
  }

  /**
   * Méthode appelée après un clic sur le toogle d'une préférence
   */
  onPreferenceToggle(preference: Preference) {
    this.onPreferenceChange(preference);
  }

  /**
   * Méthode appelée après un changement de préférence
   */
  onPreferenceChange(preference: Preference) {
    this.preferenceService.setPreferenceValue(TurnType[preference.code.toUpperCase()], preference.value);
  }

  /**
   * Méthode de fermeture de l'application
   */
  onCloseClick() {
    this.navCtrl.pop();
  }
}
