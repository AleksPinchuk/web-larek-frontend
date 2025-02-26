import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: (event: MouseEvent) => void;
}

export class Success extends Component<ISuccess> {
	protected _total: HTMLElement;
	protected _closeBtn: HTMLButtonElement;

	constructor(protected container: HTMLElement, actions?: ISuccessActions) {
		super(container);

		this._total = ensureElement<HTMLElement>('.order-success__description', this.container);
		this._closeBtn = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

		if (actions?.onClick) {
			this._closeBtn.addEventListener('click', actions.onClick.bind(this));
		}
	}

	set total(value: number) {
		if (value < 0) {
			console.warn('Ошибка: сумма не может быть отрицательной');
			return;
		}
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}