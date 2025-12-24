import { Directive, input, computed } from '@angular/core';

@Directive({
  selector: '[tableResizableHeader]',
  host: {
    '[style.width]': 'width()',
  },
  standalone: true,
})
export class TableResizableHeader {
  readonly cellId = input.required<string>({
    alias: 'tableResizableHeader',
  });

  readonly width = computed(
    () => `calc(var(--header-${this.cellId()}-size) * 1px)`,
  );
}
