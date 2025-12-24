import { Directive, input, computed } from '@angular/core';

@Directive({
  selector: '[tableResizableCell]',
  host: {
    '[style.width]': 'width()',
  },
  standalone: true,
})
export class TableResizableCell {
  readonly cellId = input.required<string>({
    alias: 'tableResizableCell',
  });

  readonly width = computed(
    () => `calc(var(--col-${this.cellId()}-size) * 1px)`,
  );
}
