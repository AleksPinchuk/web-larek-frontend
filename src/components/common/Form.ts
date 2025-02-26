import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

interface IFormState {
    valid: boolean;
    errors: string[];
}

export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        // Инициализация элементов формы
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        // Обработчик изменений в полях формы
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        // Обработчик отправки формы
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    // Обработка изменения значения в поле формы
    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    // Установка состояния валидности формы
    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    // Установка ошибок формы
    set errors(value: string | string[]) {
        // Если передан массив ошибок, то отображаем их все, если строка — обрабатываем как одну ошибку
        if (Array.isArray(value)) {
            this.setText(this._errors, value.join('<br>')); // Для отображения нескольких ошибок
        } else {
            this.setText(this._errors, value); // Для одной ошибки
        }
    }

    // Метод для рендеринга состояния формы
    render(state: Partial<T> & IFormState) {
        const { valid, errors, ...inputs } = state;

        // Вызываем рендер родительского компонента
        super.render({ valid, errors });

        // Присваиваем значения входным данным
        Object.assign(this, inputs);

        return this.container;
    }
}
