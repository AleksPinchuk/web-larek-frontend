import { Form } from '../../shared/ui/Form/Form';
import { IOrderAddress } from '../../types';
import { IEvents } from '../../shared/utils/events';
import { ensureAllElements } from '../../shared/utils/utils';

export class OrderFormAddress extends Form<IOrderAddress> {
	protected _buttons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);

		this._buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.setPayment(button.name);
			});
		});
	}
	setPayment(name: string) {
		this._buttons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
			this.onInputChange('payment', name);
		});
	}
}
