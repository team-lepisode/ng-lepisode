import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'lepi-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent {
  /**
   * Position of the dropdown menu.
   * Options: 'end', 'top', 'bottom', 'left', 'right'
   */
  position = input<'end' | 'top' | 'bottom' | 'left' | 'right' | ''>('');

  /**
   * Whether the dropdown should open on hover.
   */
  hover = input<boolean>(false);

  /**
   * Optional extra classes for the dropdown container.
   */
  class = input<string>('');

  /**
   * Optional extra classes for the content ul.
   */
  contentClass = input<string>('');
}
