import { Form } from '../../shared/ui/Form/Form';
import { IOrderContacts } from '../../types';
import { IEvents } from '../../shared/utils/events';

export class OrderFormContacts extends Form<IOrderContacts> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
}
