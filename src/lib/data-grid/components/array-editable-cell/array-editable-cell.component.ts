/* eslint-disable @angular-eslint/no-output-native */
import {
  Component,
  effect,
  input,
  model,
  output,
  untracked,
} from '@angular/core';
import { DataGridColumnTypes } from '../../data-grid.type';
import {
  NgLabelTemplateDirective,
  NgOptionTemplateDirective,
  NgSelectComponent,
} from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-array-editable-cell',
  templateUrl: 'array-editable-cell.component.html',
  imports: [
    NgSelectComponent,
    TranslatePipe,
    NgOptionTemplateDirective,
    NgLabelTemplateDirective,
    FormsModule,
  ],
  host: {
    style: 'display: block; width: 100%; height: 100%;',
  },
})
export class ArrayEditableCellComponent {
  readonly modelValue = model<unknown>();
  readonly value = input<unknown>();
  readonly type = input<DataGridColumnTypes>('array');
  readonly blur = output<unknown>();
  readonly allowAdditions = input<boolean>(false);

  constructor() {
    effect(() => {
      const value = this.value();
      untracked(() => this.modelValue.set(value));
    });
  }

  onTagAdd(tag: string) {
    const currentValue = this.modelValue() as string[];
    this.modelValue.set([...currentValue, tag]);
  }
}
