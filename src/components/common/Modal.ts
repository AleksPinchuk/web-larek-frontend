import {Component} from "../base/Component";
import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/events";

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    private isOpen: boolean = false; // Флаг для отслеживания состояния окна

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        if (this.isOpen) return; // Не открывать, если уже открыто
        this.container.classList.add('modal_active');
        this.isOpen = true; // Устанавливаем флаг открытого окна
        this.events.emit('modal:open');
    }

    close() {
        if (!this.isOpen) return; // Не закрывать, если уже закрыто
        this.container.classList.remove('modal_active');
        this.isOpen = false; // Сбрасываем флаг закрытого окна
        this.content = null;
        this.events.emit('modal:close');
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        // Уберите вызов open() здесь
        return this.container;
    }
}