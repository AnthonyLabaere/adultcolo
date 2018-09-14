import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { GamePage } from '../pages/game/game';
import { HomePage } from '../pages/home/home';
import { Adultcolo } from './app.component';
import { CommonService } from './_services/common.service';
import { ConditionService } from './_services/condition.service';
import { GameService } from '../pages/game/game.service';
import { PlayerService } from './_services/player.service';
import { ThemeService } from './_services/theme.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    Adultcolo,
    HomePage,
    GamePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(Adultcolo),
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
    GamePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonService,
    ConditionService,
    GameService,
    PlayerService,
    ThemeService
  ]
})
export class AppModule {}
