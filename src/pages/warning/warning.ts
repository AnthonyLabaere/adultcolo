import { Component } from '@angular/core';
import { ViewController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-warning',
  templateUrl: 'warning.html'
})
export class WarningPage {

  constructor(public viewCtrl: ViewController, private platform: Platform) {
  }

  onCloseClick() {
    this.platform.exitApp();
  }

  onContinueClick() {
    this.viewCtrl.dismiss();
  }
}
