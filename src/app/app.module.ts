import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { PlayPage } from '../pages/play/play';
import { PlayService } from '../pages/play/play.service';
import { Adultcolo } from './app.component';
import { CommonService } from './_services/common.service';
import { PlayerService } from './_services/player.service';
import { ThemeService } from './_services/theme.service';
import { TurnEntryService } from './_services/turnEntry.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    Adultcolo,
    HomePage,
    PlayPage
  ],
  imports: [
    BrowserModule,
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
    PlayPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonService,
    PlayService,
    PlayerService,
    ThemeService,
    TurnEntryService
  ]
})
export class AppModule {}
