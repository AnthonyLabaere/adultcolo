import { Component } from '@angular/core';
import { ViewController, Platform } from 'ionic-angular';
import { LocalizedService } from '../../app/_services/localized.service';

@Component({
  selector: 'page-warning',
  templateUrl: 'warning.html'
})
export class WarningPage {

  constructor(public viewCtrl: ViewController, private platform: Platform, private localizedService: LocalizedService) {
  }

  /**
   * Vérifie si les traductions sont chargées
   * 
   * @return un booléen indiquant si les traductions sont chargées
   */
  public areTranslationsLoaded(): boolean {
    return this.localizedService.areTranslationsLoaded();
  }

  onCloseClick() {
    this.platform.exitApp();
  }

  onContinueClick() {
    this.viewCtrl.dismiss();
  }
}
