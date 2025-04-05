import { Component } from "../Component/Component";
import { IEvents } from "../../utils/events";
import { ensureElement } from "../../utils/utils";

interface IFormState {
    valid: boolean;
    errors: string[];
}

export class Form<T> extends Component<IFormState> {
    protected _submitButton: HTMLButtonElement;
    protected _errorContainer: HTMLElement;

    constructor(protected formElement: HTMLFormElement, protected events: IEvents) {
        super(formElement);

        this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.formElement);
        this._errorContainer = ensureElement<HTMLElement>('.form__errors', this.formElement);

        this.formElement.addEventListener('input', this.handleInputChange.bind(this));
        this.formElement.addEventListener('submit', this.handleSubmit.bind(this));
    }

    private handleInputChange(e: Event) {
        const target = e.target as HTMLInputElement;
        const fieldName = target.name as keyof T;
        const fieldValue = target.value;
        this.emitFieldChange(fieldName, fieldValue);
    }

    private handleSubmit(e: Event) {
        e.preventDefault();
        this.events.emit(`${this.formElement.name}:submit`);
    }

    protected emitFieldChange(field: keyof T, value: string) {
        this.events.emit(`${this.formElement.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this._submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.updateErrorText(value);
    }

    private updateErrorText(value: string) {
        this._errorContainer.textContent = value;
    }

    render(state: Partial<T> & IFormState) {
        const { valid, errors, ...inputValues } = state;
        super.render({ valid, errors });
        Object.assign(this, inputValues);
        return this.formElement;
    }
}
