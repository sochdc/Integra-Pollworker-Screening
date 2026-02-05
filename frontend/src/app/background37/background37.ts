import { CommonModule } from '@angular/common';
import { Component, effect, input, output } from '@angular/core';

@Component({
  selector: 'app-background37',
  imports: [CommonModule],
  templateUrl: './background37.html',
  styleUrl: './background37.scss',
})
export class Background37 {
public readonly show = input<boolean>(false);
public readonly close = output<boolean>();
public readonly showhas = input<boolean>(false);
   constructor() {
    effect(() => {
      
    });
  }

  closeSlider()
  {
    this.close.emit(true);
  }

}
