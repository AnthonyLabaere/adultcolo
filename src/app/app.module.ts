import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRate } from '@ionic-native/app-rate';
import { AdMobFree } from '@ionic-native/admob-free';
import { Insomnia } from '@ionic-native/insomnia';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import { HomePage } from '../pages/home/home';
import { PlayPage } from '../pages/play/play';
import { PlayService } from '../pages/play/play.service';
import { WarningPage } from '../pages/warning/warning';
import { Adultcolo } from './app.component';
import { CommonService } from './_services/common.service';
import { PlayerService } from './_services/player.service';
import { TurnEntryService } from './_services/turnEntry.service';
import { LocalizedService } from './_services/localized.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    Adultcolo,
    HomePage,
    PlayPage,
    WarningPage,
    ProgressBarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(Adultcolo, {
      scrollPadding: false,
      scrollAssist: false
    }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Adultcolo,
    HomePage,
    PlayPage,
    WarningPage
  ],
  providers: [
    StatusBar,
    Insomnia,
    AppRate,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AdMobFree,
    CommonService,
    LocalizedService,
    PlayService,
    PlayerService,
    TurnEntryService
  ]
})
export class AppModule {}
