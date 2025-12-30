import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FontLoaderService {
  private loadedFonts = new Set<string>();
  private loadingPromises = new Map<string, Promise<void>>();

  async loadGoogleFont(
    fontName: string,
    weights: string[] = ['400', '500', '700'],
  ): Promise<void> {
    if (this.loadedFonts.has(fontName)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(fontName)) {
      const existingPromise = this.loadingPromises.get(fontName);
      if (existingPromise) {
        return existingPromise;
      }
    }

    const promise = this.loadFont(fontName, weights);
    this.loadingPromises.set(fontName, promise);

    try {
      await promise;
      this.loadedFonts.add(fontName);
    } catch (error) {
      console.error(`Failed to load font: ${fontName}`, error);
      this.loadingPromises.delete(fontName);
      throw error;
    }

    return promise;
  }

  private async loadFont(fontName: string, weights: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      // Google Fonts CSS URL 생성
      const weightsParam = weights.join(',');
      const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@${weightsParam}&display=swap`;

      // 이미 로드된 링크가 있는지 확인
      const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
      if (existingLink) {
        resolve();
        return;
      }

      // CSS 링크 요소 생성
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontUrl;

      link.onload = () => {
        // 폰트가 실제로 사용 가능한지 확인
        this.waitForFontLoad(fontName).then(resolve).catch(reject);
      };

      link.onerror = () => {
        reject(new Error(`Failed to load font stylesheet: ${fontName}`));
      };

      document.head.appendChild(link);
    });
  }

  private async waitForFontLoad(fontName: string): Promise<void> {
    if (!('fonts' in document)) {
      // FontFace API가 지원되지 않는 경우 짧은 지연 후 완료로 처리
      return new Promise((resolve) => setTimeout(resolve, 100));
    }

    try {
      await document.fonts.load(`16px "${fontName}"`);
      return Promise.resolve();
    } catch (error) {
      console.warn(`Font loading check failed for ${fontName}:`, error);
      // 폰트 로딩 체크에 실패해도 CSS는 로드되었으므로 성공으로 처리
      return Promise.resolve();
    }
  }

  /**
   * 폰트가 로드되었는지 확인
   */
  isFontLoaded(fontName: string): boolean {
    return this.loadedFonts.has(fontName);
  }

  /**
   * 모든 로드된 폰트 목록 반환
   */
  getLoadedFonts(): string[] {
    return Array.from(this.loadedFonts);
  }

  /**
   * 시스템 폰트인지 확인 (로딩이 필요하지 않은 폰트)
   */
  isSystemFont(fontName: string): boolean {
    const systemFonts = [
      'Arial',
      'Helvetica',
      'Times New Roman',
      'Georgia',
      'Verdana',
      'Courier New',
      'Malgun Gothic',
      'sans-serif',
      'serif',
      'monospace',
    ];
    return systemFonts.includes(fontName);
  }
}
