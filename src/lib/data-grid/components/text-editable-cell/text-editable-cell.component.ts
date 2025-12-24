/* eslint-disable @angular-eslint/no-output-native */
import {
  Component,
  effect,
  input,
  model,
  output,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataGridColumnTypes } from '../../data-grid.type';

@Component({
  selector: 'app-text-editable-cell',
  imports: [FormsModule],
  template: `
    <input
      class="w-full outline-none text-ellipsis"
      [type]="type()"
      [ngModel]="modelValue()"
      (ngModelChange)="modelValue.set($event)"
      (blur)="blur.emit(modelValue())"
      spellcheck="false"
    />
  `,
  host: {
    style: 'flex-grow: 1; height: 100%; display: block;',
  },
})
export class TextEditableCellComponent {
  readonly modelValue = model<unknown>(undefined);
  readonly value = input<unknown>();
  readonly type = input<DataGridColumnTypes>('text');
  readonly blur = output<unknown>();

  constructor() {
    effect(() => {
      const value = this.value();
      untracked(() => this.modelValue.set(value));
    });
  }
}
