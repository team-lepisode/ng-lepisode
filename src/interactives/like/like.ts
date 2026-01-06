import { Component, HostBinding, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-like',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './like.html',
  styleUrls: ['./like.css'],
})
export class Like {
  class = input<string>('');

  value = model(false);
  type = input<'mend' | 'bounce'>('bounce');
  size = input<'sm' | 'md' | 'lg'>('md');

  toggle() {
    this.value.update(v => !v);
  }
}
