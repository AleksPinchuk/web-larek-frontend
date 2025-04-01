import { Form } from '../../shared/ui/Form/Form';
import { IContactInfo } from '../../types';  // Используем IContactInfo
import { IEvents } from '../../shared/utils/events';

export class OrderFormContacts extends Form<IContactInfo> {
    errors: string[] = []; // errors теперь массив строк

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    private updateFormStatus() {
        this.render({
            isValid: this.errors.length === 0, // Если ошибок нет, форма валидна
            errorMessages: this.errors // Передаем массив ошибок
        });
    }
}




