import { Component, Input } from '@angular/core';

/**
 * Composant d'une barre de progression
 */
@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {
 
  @Input('progress') progress;
 
  constructor() {
 
  }
 
}