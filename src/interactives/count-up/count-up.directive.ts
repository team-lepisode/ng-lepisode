import {
	DestroyRef,
	Directive,
	ElementRef,
	effect,
	inject,
	input,
} from '@angular/core';

/** 애니메이션 설정 상수 */
const AnimationConfig = {
	/** 폰트 크기 축소 최소 비율 (50%) */
	MIN_FONT_SCALE: 0.5,
	/** easeOutExpo 감속 계수 */
	EASE_OUT_EXPO_FACTOR: -10,
} as const;

/** 애니메이션 상태 */
interface AnimationState {
	frameId: number | null;
	timerId: ReturnType<typeof setTimeout> | null;
}

/**
 * CountUp Directive
 *
 * 숫자가 시작값에서 목표값까지 점진적으로 카운트업되는 애니메이션을 제공합니다.
 * Toss 스타일의 프리미엄 인터랙션을 구현합니다.
 *
 * @example
 * ```html
 * <span [appCountUp]="balance()" [duration]="800" [prefix]="'₩ '"></span>
 * ```
 *
 * @usageNotes
 * ### 기본 옵션
 * - `appCountUp`: 애니메이션할 목표 숫자값 (Signal 호환)
 * - `duration`: 애니메이션 지속 시간 (ms), 기본값 800
 * - `delay`: 애니메이션 시작 지연 시간 (ms), 기본값 0
 * - `startRatio`: 시작 비율 (0~1), 0.5 = 50%부터 시작, 기본값 0.5
 *
 * ### 포맷팅 옵션
 * - `prefix`: 숫자 앞에 붙일 문자열 (예: '₩ ')
 * - `suffix`: 숫자 뒤에 붙일 문자열 (예: '원')
 * - `locale`: 숫자 포맷 로케일, 기본값 'ko-KR'
 * - `decimals`: 소수점 자릿수, 기본값 0
 *
 * ### 자동 크기 조절 옵션
 * - `autoScale`: 글자 길이에 따라 폰트 크기 자동 조절, 기본값 false
 * - `baseFontSize`: 기준 폰트 크기 (rem), 기본값 3 (text-5xl)
 * - `maxChars`: 기준 폰트 크기를 유지할 최대 글자 수, 기본값 10
 */
@Directive({
	selector: '[appCountUp]',
	standalone: true,
})
export class CountUpDirective {
	private readonly el = inject(ElementRef<HTMLElement>);
	private readonly destroyRef = inject(DestroyRef);

	/** 목표 숫자값 */
	readonly value = input.required<number>({ alias: 'appCountUp' });

	/** 애니메이션 지속 시간 (ms) */
	readonly duration = input(800);

	/** 애니메이션 시작 지연 시간 (ms) */
	readonly delay = input(0);

	/** 시작 비율 (0~1) - 0.5 = 50%부터 시작 */
	readonly startRatio = input(0.5);

	/** 숫자 앞에 붙일 문자열 */
	readonly prefix = input('');

	/** 숫자 뒤에 붙일 문자열 */
	readonly suffix = input('');

	/** 숫자 포맷 로케일 */
	readonly locale = input('ko-KR');

	/** 소수점 자릿수 */
	readonly decimals = input(0);

	/** 글자 길이에 따라 폰트 크기 자동 조절 */
	readonly autoScale = input(false);

	/** 기준 폰트 크기 (rem) - autoScale 사용 시 */
	readonly baseFontSize = input(3);

	/** 기준 폰트 크기를 유지할 최대 글자 수 - autoScale 사용 시 */
	readonly maxChars = input(10);

	private readonly animation: AnimationState = {
		frameId: null,
		timerId: null,
	};

	private formatterCache: {
		instance: Intl.NumberFormat | null;
		key: string;
	} = { instance: null, key: '' };

	constructor() {
		this.registerCleanup();
		this.observeValueChanges();
	}

	/** 컴포넌트 파괴 시 리소스 정리 등록 */
	private registerCleanup(): void {
		this.destroyRef.onDestroy(() => this.stopAnimation());
	}

	/** Signal 값 변경 감지 및 애니메이션 트리거 */
	private observeValueChanges(): void {
		effect(() => {
			const target = this.value();
			this.startAnimation(target);
		});
	}

	/** 진행 중인 애니메이션을 중지합니다 */
	private stopAnimation(): void {
		const { frameId, timerId } = this.animation;

		if (timerId !== null) {
			clearTimeout(timerId);
			this.animation.timerId = null;
		}

		if (frameId !== null) {
			cancelAnimationFrame(frameId);
			this.animation.frameId = null;
		}
	}

	/** 카운트업 애니메이션을 시작합니다 */
	private startAnimation(targetValue: number): void {
		this.stopAnimation();

		const duration = this.duration();
		const delay = this.delay();
		const startValue = targetValue * this.startRatio();

		this.animation.timerId = setTimeout(() => {
			this.runAnimationLoop(startValue, targetValue, duration);
		}, delay);
	}

	/** 애니메이션 루프를 실행합니다 */
	private runAnimationLoop(
		startValue: number,
		targetValue: number,
		duration: number,
	): void {
		const startTime = performance.now();

		const tick = (currentTime: number) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const easedProgress = this.easeOutExpo(progress);

			const currentValue = this.lerp(startValue, targetValue, easedProgress);
			this.render(currentValue);

			if (progress < 1) {
				this.animation.frameId = requestAnimationFrame(tick);
			} else {
				this.render(targetValue); // 정확한 최종값 보장
				this.animation.frameId = null;
			}
		};

		this.animation.frameId = requestAnimationFrame(tick);
	}

	/**
	 * easeOutExpo - 극적인 감속 효과
	 * 빠르게 시작해서 부드럽게 착지하는 토스 스타일 애니메이션
	 */
	private easeOutExpo(t: number): number {
		if (t === 1) return 1;
		return 1 - Math.pow(2, AnimationConfig.EASE_OUT_EXPO_FACTOR * t);
	}

	/** 선형 보간 (Linear Interpolation) */
	private lerp(start: number, end: number, t: number): number {
		return start + (end - start) * t;
	}

	/** 화면에 값을 렌더링합니다 */
	private render(value: number): void {
		const formattedText = this.formatNumber(value);

		// 초기 렌더링 시 DOM 구조 생성
		if (!this.el.nativeElement.querySelector('.count-up-container')) {
			this.initializeContainer();
		}

		this.updateDigits(formattedText);
		this.applyStyles(formattedText);
	}

	/** 컨테이너와 기본 구조를 초기화합니다 */
	private initializeContainer(): void {
		const el = this.el.nativeElement;
		el.innerHTML = '';
		el.style.display = 'inline-flex';
		el.style.alignItems = 'baseline';
		el.style.overflow = 'hidden';
		el.style.lineHeight = '1';

		const container = document.createElement('span');
		container.className = 'count-up-container';
		container.style.display = 'inline-flex';
		container.style.alignItems = 'baseline';

		// Prefix
		if (this.prefix()) {
			const prefixSpan = document.createElement('span');
			prefixSpan.className = 'prefix';
			prefixSpan.textContent = this.prefix();
			container.appendChild(prefixSpan);
		}

		// Digits Wrapper
		const digitsWrapper = document.createElement('span');
		digitsWrapper.className = 'digits-wrapper';
		digitsWrapper.style.display = 'inline-flex';
		digitsWrapper.style.alignItems = 'baseline';
		container.appendChild(digitsWrapper);

		// Suffix
		if (this.suffix()) {
			const suffixSpan = document.createElement('span');
			suffixSpan.className = 'suffix';
			suffixSpan.textContent = this.suffix();
			container.appendChild(suffixSpan);
		}

		el.appendChild(container);
	}

	/** 각 자릿수를 업데이트하거나 새로 생성합니다 */
	private updateDigits(formattedText: string): void {
		const wrapper = this.el.nativeElement.querySelector('.digits-wrapper') as HTMLElement;
		if (!wrapper) return;

		const currentChars = Array.from(formattedText);
		const existingColumns = Array.from(wrapper.children);

		// 기존 컬럼 수가 다르면 초기화 (단순화를 위해)
		if (existingColumns.length !== currentChars.length) {
			wrapper.innerHTML = '';
			currentChars.forEach(char => {
				wrapper.appendChild(this.createColumn(char));
			});
		} else {
			// 기존 컬럼 업데이트
			currentChars.forEach((char, index) => {
				const col = existingColumns[index] as HTMLElement;
				this.updateColumn(col, char);
			});
		}
	}

	/** 자릿수 컬럼을 생성합니다 */
	private createColumn(char: string): HTMLElement {
		const col = document.createElement('span');

		if (/\d/.test(char)) {
			col.className = 'digit-column';
			col.style.display = 'inline-block';
			col.style.position = 'relative';
			col.style.height = '1.2em';
			col.style.overflow = 'hidden';
			col.style.width = '0.6em';
			col.style.textAlign = 'center';

			const strip = document.createElement('div');
			strip.className = 'digit-strip';
			strip.style.display = 'flex';
			strip.style.flexDirection = 'column';
			strip.style.transition = `transform ${this.duration()}ms cubic-bezier(0.2, 0, 0, 1)`;
			strip.style.willChange = 'transform';

			// 0-9 숫자 생성
			for (let i = 0; i <= 9; i++) {
				const val = document.createElement('div');
				val.className = 'digit-value';
				val.style.display = 'flex';
				val.style.alignItems = 'center';
				val.style.justifyContent = 'center';
				val.style.height = '1.2em';
				val.style.width = '100%';
				val.textContent = i.toString();
				strip.appendChild(val);
			}

			col.appendChild(strip);
			this.setStripPosition(strip, char);
		} else {
			col.className = 'separator';
			col.style.display = 'inline-block';
			col.textContent = char;
		}

		return col;
	}

	/** 기존 컬럼을 업데이트합니다 */
	private updateColumn(col: HTMLElement, char: string): void {
		if (col.classList.contains('digit-column')) {
			const strip = col.querySelector('.digit-strip') as HTMLElement;
			if (strip && /\d/.test(char)) {
				this.setStripPosition(strip, char);
			}
		} else if (col.classList.contains('separator')) {
			if (col.textContent !== char) {
				col.textContent = char;
			}
		}
	}

	/** 숫자에 따라 스트립의 위치를 설정합니다 */
	private setStripPosition(strip: HTMLElement, char: string): void {
		const digit = parseInt(char, 10);
		// 1.2em is the height of each digit-value
		strip.style.transform = `translateY(-${digit * 1.2}em)`;
	}

	/** 숫자를 포맷팅합니다 */
	private formatNumber(value: number): string {
		const formatter = this.getOrCreateFormatter();
		const roundedValue = this.roundToDecimals(value);
		return formatter.format(roundedValue);
	}

	/** 소수점 자릿수에 맞게 반올림합니다 */
	private roundToDecimals(value: number): number {
		const multiplier = Math.pow(10, this.decimals());
		return Math.round(value * multiplier) / multiplier;
	}

	/** 캐시된 Formatter를 반환하거나 새로 생성합니다 */
	private getOrCreateFormatter(): Intl.NumberFormat {
		const cacheKey = `${this.locale()}-${this.decimals()}`;

		if (this.formatterCache.key !== cacheKey) {
			this.formatterCache = {
				key: cacheKey,
				instance: new Intl.NumberFormat(this.locale(), {
					minimumFractionDigits: this.decimals(),
					maximumFractionDigits: this.decimals(),
				}),
			};
		}

		return this.formatterCache.instance!;
	}

	/** 스타일을 적용합니다 */
	private applyStyles(text: string): void {
		const el = this.el.nativeElement;

		// 자동 폰트 크기 조절
		if (this.autoScale()) {
			el.style.fontSize = this.calculateFontSize(text.length);
		}
	}

	/** 텍스트 길이에 따른 폰트 크기를 계산합니다 */
	private calculateFontSize(charCount: number): string {
		const maxChars = this.maxChars();
		const baseFontSize = this.baseFontSize();

		if (charCount <= maxChars) {
			return `${baseFontSize}rem`;
		}

		const scale = Math.max(AnimationConfig.MIN_FONT_SCALE, maxChars / charCount);
		return `${baseFontSize * scale}rem`;
	}
}
