import { Component } from '../../shared/ui/Component/Component';
import { IEvents } from '../../shared/utils/events';
import { ensureElement } from '../../shared/utils/utils';

interface ISuccessDetails {
    totalAmount: number;  // Переменовано имя свойства
}

interface IButtonActions {
    onClick: (event: MouseEvent) => void;  
}

export class OrderSuccessMessage extends Component<ISuccessDetails> {  // Переименован класс
    private _description: HTMLElement;  // Переменная описания
    private _closeActionButton: HTMLButtonElement;  // Переменная кнопки

    constructor(container: HTMLElement, private buttonActions?: IButtonActions) {  // Убрано "protected"
        super(container);

        // Переименование элементов с явным описанием
        this._description = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._closeActionButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        // Вешаем обработчик события на кнопки с обработчиком
        if (this.buttonActions?.onClick) {
            this._closeActionButton.addEventListener('click', this.buttonActions.onClick);
        }
    }

    set totalAmount(amount: number) {  // Уникальный сеттер
        this.setText(this._description, `Вы успешно потратили ${amount} синапсов`);
    }
}


