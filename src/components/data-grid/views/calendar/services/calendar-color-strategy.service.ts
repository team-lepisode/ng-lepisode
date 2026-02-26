import { Injectable } from '@angular/core';
import { EventApi } from '@fullcalendar/core';

export type ColorStrategyType = 'sequential' | 'field' | 'hash';

export interface ColorStrategyOptions {
  colorField?: string;
  strategy?: ColorStrategyType;
}

@Injectable()
export class CalendarColorStrategyService {
  private readonly colorPalette = [
    'var(--color-primary)',
    'var(--color-secondary)',
    'var(--color-accent)',
    'var(--color-info)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-error)',
  ] as const;

  getColor(event: EventApi, options?: ColorStrategyOptions): string {
    const strategy = options?.strategy ?? 'sequential';

    switch (strategy) {
      case 'field':
        return this.getFieldColor(event, options?.colorField);
      case 'hash':
        return this.getHashColor(event);
      default:
        return this.getSequentialColor(event);
    }
  }

  getPaletteColor(index: number): string {
    return this.colorPalette[index % this.colorPalette.length];
  }

  getPalette(): readonly string[] {
    return this.colorPalette;
  }

  private getFieldColor(event: EventApi, colorField?: string): string {
    if (colorField && event.extendedProps?.[colorField]) {
      return event.extendedProps[colorField];
    }
    return this.getSequentialColor(event);
  }

  private getHashColor(event: EventApi): string {
    const id = event.id ?? '';
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
    }
    return this.colorPalette[Math.abs(hash) % this.colorPalette.length];
  }

  private getSequentialColor(event: EventApi): string {
    const idLength = event.id?.toString().length ?? 0;
    return this.colorPalette[Math.abs(idLength) % this.colorPalette.length];
  }
}
