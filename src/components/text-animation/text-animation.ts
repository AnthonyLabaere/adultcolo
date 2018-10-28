import { Component, Input, OnInit } from '@angular/core';

/**
 * Composant d'affichage d'un texte animé
 */
@Component({
  selector: 'text-animation',
  templateUrl: 'text-animation.html'
})
export class TextAnimationComponent implements OnInit {

    /** Chaîne de caractères à afficher */
    @Input() str: string;
    /** Indique si le mode d'affichage doit être rapide */
    @Input() fast: boolean = false;
    /** Délai en secondes avant affichage du texte */
    @Input() delay: number = 0;
 
    /** Chaîne de caractères à afficher */
    public chars: string[];
 
    constructor() {
        
    }

    /**
     * Méthode appelée après initialisation du composant
     */
    ngOnInit() {
        setTimeout(() => {
            this.chars = this.str.split('');
        }, this.delay * 1000);
    }
 
}