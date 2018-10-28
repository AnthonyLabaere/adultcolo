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
 
    /** Chaîne de caractères à afficher */
    public chars: string[];
 
    constructor() {
        
    }

    /**
     * Méthode appelée après initialisation du composant
     */
    ngOnInit() {
        this.chars = this.str.split('');
    }
 
}