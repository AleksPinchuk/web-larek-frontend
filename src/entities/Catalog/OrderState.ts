import { IOrder, IOrderForm, FormErrors } from '../../types';
import { Model } from '../../shared/utils/model';

export class OrderState extends Model<{ order: IOrder }> {
    order: IOrder = {
        payment: '',
        address: '',
        email: '',
        phone: '',
    };
    formErrors: FormErrors = {};

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder() {
        const errors: FormErrors = this.validateOrderFields();
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    resetOrder() {
        this.order = {
            payment: '',
            address: '',
            email: '',
            phone: '',
        };
    }

    private validateOrderFields(): FormErrors {
        const errors: FormErrors = {};
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        return errors;
    }
}