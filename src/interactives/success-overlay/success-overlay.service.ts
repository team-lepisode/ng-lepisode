import {
	ApplicationRef,
	ComponentRef,
	createComponent,
	inject,
	Injectable,
	Renderer2,
	RendererFactory2,
	signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CheckmarkComponent } from './checkmark';

const ANIMATION_DURATION = 200;
const OVERLAY_STYLES = `
	.success-overlay {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		background: oklch(from var(--color-base-100, white) l c h / 0.95);
		animation: overlay-fade-in 0.2s ease-out;
	}
	.success-overlay.hiding {
		animation: overlay-fade-in 0.2s ease-out reverse;
	}
	.success-overlay .message {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-success, oklch(0.65 0.2 145));
		opacity: 0;
		animation: message-fade-up 0.3s ease-out 0.6s forwards;
	}
	@keyframes overlay-fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	@keyframes message-fade-up {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}
`;

@Injectable({ providedIn: 'root' })
export class SuccessOverlayService {
	private readonly appRef = inject(ApplicationRef);
	private readonly document = inject(DOCUMENT);
	private readonly renderer: Renderer2;

	private overlayElement: HTMLElement | null = null;
	private componentRef: ComponentRef<CheckmarkComponent> | null = null;

	readonly isVisible = signal(false);

	constructor() {
		const rendererFactory = inject(RendererFactory2);
		this.renderer = rendererFactory.createRenderer(null, null);
	}

	show(message = '완료!', duration = 1500): Promise<void> {
		return new Promise((resolve) => {
			if (!this.document.body) {
				resolve();
				return;
			}

			if (this.overlayElement) {
				this.destroyOverlay();
			}

			this.createOverlay(message);
			this.isVisible.set(true);

			setTimeout(() => this.hideWithAnimation(resolve), duration);
		});
	}

	private createOverlay(message: string): void {
		const { renderer, document } = this;

		this.overlayElement = renderer.createElement('div');
		renderer.addClass(this.overlayElement, 'success-overlay');

		const styleEl = renderer.createElement('style');
		renderer.appendChild(styleEl, renderer.createText(OVERLAY_STYLES));
		renderer.appendChild(this.overlayElement, styleEl);

		const checkmarkContainer = renderer.createElement('div');
		renderer.appendChild(this.overlayElement, checkmarkContainer);

		const messageEl = renderer.createElement('p');
		renderer.addClass(messageEl, 'message');
		renderer.appendChild(messageEl, renderer.createText(message));
		renderer.appendChild(this.overlayElement, messageEl);

		renderer.appendChild(document.body, this.overlayElement);

		this.componentRef = createComponent(CheckmarkComponent, {
			environmentInjector: this.appRef.injector,
		});
		this.componentRef.setInput('size', 80);
		this.componentRef.setInput('color', 'var(--color-success, oklch(0.65 0.2 145))');
		this.appRef.attachView(this.componentRef.hostView);
		renderer.appendChild(checkmarkContainer, this.componentRef.location.nativeElement);
	}

	private hideWithAnimation(callback: () => void): void {
		if (!this.overlayElement) {
			callback();
			return;
		}

		this.renderer.addClass(this.overlayElement, 'hiding');

		setTimeout(() => {
			this.destroyOverlay();
			callback();
		}, ANIMATION_DURATION);
	}

	private destroyOverlay(): void {
		if (this.componentRef) {
			this.appRef.detachView(this.componentRef.hostView);
			this.componentRef.destroy();
			this.componentRef = null;
		}
		if (this.overlayElement) {
			this.renderer.removeChild(this.document.body, this.overlayElement);
			this.overlayElement = null;
		}
		this.isVisible.set(false);
	}
}
