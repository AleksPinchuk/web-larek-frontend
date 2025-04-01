import { Component } from "../Component/Component";
import { IEvents } from "../../utils/events";
import { ensureElement } from "../../utils/utils";

export interface IFormStatus {
    isValid: boolean;
    errorMessages: string[];
}

export class Form<T> extends Component<IFormStatus> {
    private submitButton: HTMLButtonElement;
    private errorContainer: HTMLElement;

    constructor(protected formElement: HTMLFormElement, protected events: IEvents) {
        super(formElement);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.formElement);
        this.errorContainer = ensureElement<HTMLElement>('.form__errors', this.formElement);

        this.formElement.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const fieldName = target.name as keyof T;
            const fieldValue = target.value;
            this.handleInputChange(fieldName, fieldValue);
        });

        this.formElement.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.formElement.name}:submit`);
        });
    }

    handleInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.formElement.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    set isValid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errorMessages(value: string) {
        this.setText(this.errorContainer, value);
    }

    render(state: Partial<T> & IFormStatus) {
        const { isValid, errorMessages, ...inputData } = state;
        super.render({ isValid, errorMessages });
        Object.assign(this, inputData);
        return this.formElement;
    }
}
