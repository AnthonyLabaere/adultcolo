import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { Player } from "../entities";
import { CommonService } from "./common.service";

@Injectable()
export class PlayerService {

    private players: Player[];

    public static PLAYERS_MIN_NUMBER = 2;
    public static PLAYERS_MAX_NUMBER = 50;

    private static PLAYER_STORAGE_KEY_PREFIX = CommonService.ADULTCOLO_STORAGE_KEY_PREFIX + 'player-';

    constructor(private storage: Storage) {

    }

    public hasEnoughtPlayers() {
        return this.getPlayers().length >= PlayerService.PLAYERS_MIN_NUMBER;
    }

    public getPlayers() {
        return this.players.filter((player: Player) => {
            return !CommonService.isEmpty(player.name);
        });
    }

    public setPlayers(players: Player[]) {
        this.players = players;
    }

    private getPlayerStorageKey(index: number) {
        return PlayerService.PLAYER_STORAGE_KEY_PREFIX + index;
    }

    public getSavedPlayersOnStorage(): Promise<Player[]> {
        return this.getSavedPlayerOnStorageRecurrence(0, []);
    }

    private getSavedPlayerOnStorageRecurrence(index: number, players: Player[]): Promise<Player[]> {
        return this.storage.get(this.getPlayerStorageKey(index))
            .then((playerName: string) => {
                if (!CommonService.isEmpty(playerName)) {
                    const player = new Player();
                    player.name = playerName;
                    players.push(player);
                }

                if (index < PlayerService.PLAYERS_MAX_NUMBER - 1) {
                    return this.getSavedPlayerOnStorageRecurrence(index + 1, players);
                } else {
                    return Promise.resolve(players);
                }
            });
    }

    public savePlayersOnStorage(players: Player[]): Promise<void> {
        return this.setNewPlayersOnStorageRecurrence(0, players)
            .then(() => {
                return this.removeOldPlayersOnStorageRecurrence(players.length);
            });
    }

    private setNewPlayersOnStorageRecurrence(index: number, players: Player[]): Promise<void> {
        return this.storage.set(this.getPlayerStorageKey(index), players[index].name)
            .then(() => {
                if (index < players.length - 1) {
                    return this.setNewPlayersOnStorageRecurrence(index + 1, players);
                } else {
                    return Promise.resolve();
                }
            });
    }

    private removeOldPlayersOnStorageRecurrence(index: number): Promise<void> {
        const playerStorageKey = this.getPlayerStorageKey(index);
        
        return this.storage.get(playerStorageKey)
            .then((playerName: string) => {
                if (!CommonService.isEmpty(playerName)) {
                    return this.storage.remove(playerStorageKey)
                        .then(() => {
                            if (index < PlayerService.PLAYERS_MAX_NUMBER - 1) {
                                return this.removeOldPlayersOnStorageRecurrence(index + 1);
                            } else {
                                return Promise.resolve();
                            }
                        });
                } else {
                    if (index < PlayerService.PLAYERS_MAX_NUMBER - 1) {
                        return this.removeOldPlayersOnStorageRecurrence(index + 1);
                    } else {
                        return Promise.resolve();
                    }
                }
            });
    }
}
