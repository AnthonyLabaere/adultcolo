import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { CommonService } from './_services/common.service';

@Component({
  templateUrl: 'app.html'
})
export class Adultcolo {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, translate: TranslateService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang('fr');
  
      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('fr');

      translate.get('common.sipNumber.one').subscribe((oneSipNumber: string) => {CommonService.ONE_SIP_NUMBER = oneSipNumber;});
      translate.get('common.sipNumber.two').subscribe((twoSipNumber: string) => {CommonService.TWO_SIP_NUMBER = twoSipNumber;});
      translate.get('common.sipNumber.three').subscribe((threeSipNumber: string) => {CommonService.THREE_SIP_NUMBER = threeSipNumber;});
      translate.get('common.sipNumber.four').subscribe((fourSipNumber: string) => {CommonService.FOUR_SIP_NUMBER = fourSipNumber;});
      translate.get('common.sipNumber.five').subscribe((fiveSipNumber: string) => {CommonService.FIVE_SIP_NUMBER = fiveSipNumber;});
      translate.get('common.drink').subscribe((drinkCommand: string) => {CommonService.DRINK_COMMAND = drinkCommand;});
      translate.get('common.give-out').subscribe((giveOutCommand: string) => {CommonService.GIVE_OUT_COMMAND = giveOutCommand;});
    });
  }
}

