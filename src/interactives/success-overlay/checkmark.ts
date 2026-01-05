import { Component, input } from '@angular/core';

@Component({
	selector: 'app-checkmark',
	standalone: true,
	template: `
		<svg
			[attr.width]="size()"
			[attr.height]="size()"
			viewBox="0 0 52 52"
			class="checkmark">
			<circle
				class="checkmark-circle"
				cx="26"
				cy="26"
				r="24"
				fill="none"
				[attr.stroke]="color()"
				stroke-width="3" />
			<path
				class="checkmark-check"
				fill="none"
				[attr.stroke]="color()"
				stroke-width="4"
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M14.1 27.2l7.1 7.2 16.7-16.8" />
		</svg>
	`,
	styles: [
		`
			.checkmark {
				display: block;
			}
			.checkmark-circle {
				stroke-dasharray: 166;
				stroke-dashoffset: 166;
				animation: draw-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
			}
			.checkmark-check {
				stroke-dasharray: 48;
				stroke-dashoffset: 48;
				animation: draw-check 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards;
			}
			@keyframes draw-circle {
				to {
					stroke-dashoffset: 0;
				}
			}
			@keyframes draw-check {
				to {
					stroke-dashoffset: 0;
				}
			}
		`,
	],
})
export class CheckmarkComponent {
	readonly size = input(52);
	readonly color = input('#22c55e');
}
