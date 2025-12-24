/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, inject, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DataGridComponentStore } from '../../data-grid.component.store';

@Component({
  templateUrl: './gallery-view.component.html',
  imports: [TranslatePipe],
})
export class GalleryViewComponent {
  onDetailClick = output<any>();

  protected readonly store = inject(DataGridComponentStore);
}
