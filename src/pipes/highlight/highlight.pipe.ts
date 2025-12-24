import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  transform(value: string, target: string): string {
    if (!target) {
      return value;
    }
    const escapedTarget = target.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedTarget, 'gi');
    return value.replace(regex, (match) => `<mark >${match}</mark>`);
  }
}
