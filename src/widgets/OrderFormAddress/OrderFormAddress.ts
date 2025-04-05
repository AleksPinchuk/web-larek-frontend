import { Form } from '../../shared/ui/Form/Form';
import { IOrderAddress } from '../../types';
import { IEvents } from '../../shared/utils/events';
import { ensureAllElements } from '../../shared/utils/utils';

export class OrderFormAddress extends Form<IOrderAddress> {
    protected _paymentButtons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

        this._paymentButtons.forEach((button) => {
            button.addEventListener('click', () => this.selectPaymentMethod(button.name));
        });
    }

    private selectPaymentMethod(name: string) {
        this._paymentButtons.forEach((button) => {
            const isActive = button.name === name;
            this.toggleButtonClass(button, 'button_alt-active', isActive);
            if (isActive) {
                this.emitFieldChange('payment', name);
            }
        });
    }

    private toggleButtonClass(button: HTMLButtonElement, className: string, isActive: boolean) {
        if (isActive) {
            button.classList.add(className);
        } else {
            button.classList.remove(className);
        }
    }
}
