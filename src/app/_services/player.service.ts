import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';
import { environment as ENV } from '../../environments/environment';
import { Player } from "../entities";
import { CommonService } from "./common.service";

@Injectable()
export class PlayerService {

    /** Tableau des joueurs */
    private players: Player[];

    constructor(private storage: Storage) {

    }

    /**
     * Vérifie si assez de joueurs ont été renseignés
     * 
     * @return un booléen indiquant si assez de joueurs ont été renseignés
     */
    public hasEnoughtPlayers(): boolean {
        return this.getPlayers().length >= ENV.PLAYERS_MIN_NUMBER;
    }

    /**
     * Récupère les joueurs en fonction de la précédente fréquence d'apparition
     * 
     * @return les joueurs
     */
    public getPlayerAndSecondPlayer(occurencePlayerMap: {player: Player, occurence: number}[]): Player[] {
        const player: Player = _.minBy(occurencePlayerMap, "occurence").player;
        const secondPlayer: Player = _.minBy(_.filter(occurencePlayerMap, (ocm => {
            return ocm.player.name !== player.name;
        }))).player;
        
        return [player, secondPlayer];
    }

    /**
     * Récupère les joueurs renseignés
     * 
     * @return les joueurs renseignés
     */
    public getPlayers(): Player[] {
        return this.players.filter((player: Player) => {
            return !CommonService.isEmpty(player.name);
        });
    }

    /**
     * Setter des joueurs
     * 
     * @param players les joueurs à setter
     */
    public setPlayers(players: Player[]): void {
        this.players = players;
    }

    /**
     * Récupère l'identifiant de stockage dans le cache d'un joueur
     * 
     * @param index l'index du joueur
     * 
     * @return l'identifiant de stockage dans le cache d'un joueur
     */
    private getPlayerStorageKey(index: number): string {
        return ENV.PLAYER_STORAGE_KEY_PREFIX + index;
    }

    /**
     * Récupère les joueurs stockés en cache
     * 
     * @return une promesse contenant les joueurs stockés en cache
     */
    public getSavedPlayersOnStorage(): Promise<Player[]> {
        return this.getSavedPlayesOnStorageRecurrence(0, []);
    }

    /**
     * Méthode récurrente de récupération des joueurs stockés en cache
     * 
     * @param index l'index du joueur à récupérer en cours
     * @param players le tableau des joueurs en construction
     * 
     * @return une promesse contenant les joueurs stockés en cache
     * 
     */
    private getSavedPlayesOnStorageRecurrence(index: number, players: Player[]): Promise<Player[]> {
        return this.storage.get(this.getPlayerStorageKey(index))
            .then((playerName: string) => {
                if (!CommonService.isEmpty(playerName)) {
                    const player = new Player();
                    player.name = playerName;
                    players.push(player);
                }

                if (index < ENV.PLAYERS_MAX_NUMBER - 1) {
                    return this.getSavedPlayesOnStorageRecurrence(index + 1, players);
                } else {
                    return Promise.resolve(players);
                }
            });
    }

    /**
     * Sauvegarde les joueurs dans le cache
     * 
     * @param players les joueurs à sauvegarder
     * 
     * @return une promesse vide
     */
    public savePlayersOnStorage(players: Player[]): Promise<void> {
        return this.setNewPlayersOnStorageRecurrence(0, players)
            .then(() => {
                // Suppression des joueurs en cache si l'ancien nombre de joueur était plus grand que le nouveau
                return this.removeOldPlayersOnStorageRecurrence(players.length);
            });
    }

    /**
     * Méthode récurrente de sauvegarde des joueurs dans le cache
     * 
     * @param index l'index en cours
     * @param players le tableau des joueurs à sauvegarder
     * 
     * @return une promesse vide
     */
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

    /**
     * Méthode récurrente de suppression des joueurs dans le cache à partir d'un index
     * 
     * @param index indique à partir de quel index les joueurs doivent être supprimés
     * 
     * @return une promesse vide
     */
    private removeOldPlayersOnStorageRecurrence(index: number): Promise<void> {
        const playerStorageKey = this.getPlayerStorageKey(index);
        
        return this.storage.get(playerStorageKey)
            .then((playerName: string) => {
                if (!CommonService.isEmpty(playerName)) {
                    return this.storage.remove(playerStorageKey)
                        .then(() => {
                            if (index < ENV.PLAYERS_MAX_NUMBER - 1) {
                                return this.removeOldPlayersOnStorageRecurrence(index + 1);
                            } else {
                                return Promise.resolve();
                            }
                        });
                } else {
                    if (index < ENV.PLAYERS_MAX_NUMBER - 1) {
                        return this.removeOldPlayersOnStorageRecurrence(index + 1);
                    } else {
                        return Promise.resolve();
                    }
                }
            });
    }
}
