/* eslint-disable @angular-eslint/no-output-native */
import {
  Component,
  computed,
  effect,
  input,
  model,
  output,
  untracked,
} from '@angular/core';
import { DataGridColumnTypes } from '../../data-grid.type';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';

@Component({
  imports: [FormsModule],
  template: `
    <input
      class="w-full outline-none text-ellipsis"
      [type]="type()"
      [ngModel]="_value()"
      (ngModelChange)="modelValue.set($event)"
      (blur)="blur.emit(modelValue())"
      spellcheck="false"
    />
  `,
})
export class DateEditableCellComponent {
  readonly modelValue = model<unknown>(undefined);
  readonly value = input<unknown>();
  readonly type = input<DataGridColumnTypes>('text');
  readonly blur = output<unknown>();

  _value = computed(() =>
    dayjs(this.modelValue() as string).format('YYYY-MM-DD'),
  );

  constructor() {
    effect(() => {
      const value = this.value();
      untracked(() => this.modelValue.set(value));
    });
  }
}
