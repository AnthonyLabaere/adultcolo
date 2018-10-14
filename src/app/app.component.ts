import { Component } from '@angular/core';
import { AppRate } from '@ionic-native/app-rate';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';
import { environment as ENV } from '../environments/environment';
import { HomePage } from '../pages/home/home';
import { LocalizedService } from './_services/localized.service';
import { TurnEntryService } from './_services/turnEntry.service';

/**
 * Composant principal de l'application
 */
@Component({
  templateUrl: 'app.html'
})
export class Adultcolo {

  /** Page racine de l'application */
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, translate: TranslateService, appRate: AppRate, 
                localizedService: LocalizedService, turnEntryService: TurnEntryService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang('fr');
  
      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate
        .use('fr')
        .subscribe(() => {
            // In here you can put the code you want. At this point the lang will be loaded
            localizedService.setTranslationsLoaded(true);
        });;

      if (!ENV.DEV) {
        appRate.preferences.useLanguage = translate.getDefaultLang();
        translate.get('title').subscribe((str: string) => {appRate.preferences.displayAppName = str});
        appRate.preferences.simpleMode = true;

        appRate.preferences.customLocale = {};
        translate.get('rating.title').subscribe((str: string) => {appRate.preferences.customLocale.title = str});
        translate.get('rating.message').subscribe((str: string) => {appRate.preferences.customLocale.message = str});
        translate.get('rating.cancelButtonLabel').subscribe((str: string) => {appRate.preferences.customLocale.cancelButtonLabel = str});
        translate.get('rating.rateButtonLabel').subscribe((str: string) => {appRate.preferences.customLocale.rateButtonLabel = str});
        translate.get('rating.laterButtonLabel').subscribe((str: string) => {appRate.preferences.customLocale.laterButtonLabel = str});
        
        appRate.preferences.storeAppURL = {
          // ios: '<app_id>',
          android: 'market://details?id=' + ENV.PACKAGE_NAME/*,
          windows: 'ms-windows-store://review/?ProductId=<store_id>'*/
        };

        appRate.promptForRating(false);
      }

      // Chargement des chaînes de caractères internationalisées
      localizedService.initLocalizedConstants();

      // Chargement des données sur les tours de jeu
      turnEntryService.loadAllTurnEntries();
    });
  }
}

