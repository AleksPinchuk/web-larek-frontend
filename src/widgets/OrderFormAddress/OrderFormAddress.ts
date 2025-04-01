import { Form } from '../../shared/ui/Form/Form';
import { IOrderDetails } from '../../types';  // Используем IOrderDetails
import { IEvents } from '../../shared/utils/events';
import { ensureAllElements } from '../../shared/utils/utils';
import { IFormStatus } from '../../shared/ui/Form/Form';  // Импортируем IFormStatus

export class AddressForm extends Form<IOrderDetails> {
    private actionButtons: HTMLButtonElement[];
    errors: string[] = [];  // Используем массив для ошибок

    constructor(container: HTMLFormElement, eventEmitter: IEvents) {
        super(container, eventEmitter);
        this.actionButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

        this.actionButtons.forEach((button) => {
            button.addEventListener('click', () => {
                this.selectPaymentMethod(button.name);
            });
        });
    }

    private selectPaymentMethod(paymentMethodName: string) {
        this.actionButtons.forEach((button) => {
            const isActive = button.name === paymentMethodName;
            this.toggleClass(button, 'button_alt-active', isActive);
            this.handleInputChange('paymentMethod', paymentMethodName);
        });
    }

    // Метод для обновления состояния формы
    updateFormStatus(status: IFormStatus) {
        this.render({
            ...status,  // Обновляем валидность и сообщения об ошибках
            ...this.getState()  // Получаем текущее состояние формы
        });
    }

    // Метод для получения текущего состояния формы
    private getState(): Partial<IOrderDetails> {
        // В данном случае предполагается, что состояние формы хранится в родительском классе, 
        // но если вам нужно добавить специфическое состояние для AddressForm, 
        // вы можете возвращать данные, такие как адрес доставки и метод оплаты
        return {
            paymentMethod: 'card',  // Пример поля состояния
            deliveryAddress: ''     // Пример поля состояния
        };
    }

    // Переопределение метода render с учетом статуса формы
    render(state: Partial<IOrderDetails> & IFormStatus): HTMLFormElement {
        super.render(state);  // Вызов родительского метода render
        return this.formElement;
    }
}









