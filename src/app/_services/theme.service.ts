import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ThemeData } from "../entities";

@Injectable()
export class ThemeService {

    private static THEME_DATA_FILE_PATH = '../assets/data/themes.json';

    private themesData: ThemeData[];

    constructor(private http: HttpClient) {

    }

    public getThemesData(): Promise<ThemeData[]> {
        if (this.themesData) {
            return Promise.resolve(this.themesData);
        } else {
            return new Promise(resolve => {
                this.http.get(ThemeService.THEME_DATA_FILE_PATH)
                .subscribe(
                    (themesData: ThemeData[]) => {
                        this.themesData = themesData;
    
                        resolve(themesData);
                    },
                    error => {}
                );
            });
        }
    }
}
