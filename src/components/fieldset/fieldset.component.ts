import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

/**
 * Fieldset component based on daisyUI 5.0.
 * Used to group form elements with legend, labels, and help/error text.
 *
 * @author Lepisode <lepisode@lepisode.com>
 */
@Component({
  selector: 'lepi-fieldset',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fieldset.component.html',
  styleUrls: ['./fieldset.component.css'],
})
export class FieldsetComponent {
  /**
   * Title of the fieldset. Renders as a <legend> element.
   */
  legend = input<string>('');

  /**
   * Label text for the input group.
   */
  label = input<string>('');

  /**
   * Help text displayed below the input.
   */
  helpText = input<string | null | undefined>('');

  /**
   * Error message displayed below the input. If provided, label/help text might change style.
   */
  error = input<string | null | undefined>('');

  /**
   * Whether the field is required. Adds a red asterisk to the label/legend.
   */
  required = input<boolean>(false);

  /**
   * Optional extra classes for the fieldset container.
   */
  class = input<string>('');
}
