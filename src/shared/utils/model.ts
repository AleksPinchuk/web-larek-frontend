import { IEvents } from "./events";

export abstract class Model<T> {
    constructor(protected data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }

    protected emitChanges(event: string, payload?: object): void {
        this.events.emit(event, payload ?? {});
    }

    // Обновление данных модели
    protected update(data: Partial<T>): void {
        Object.assign(this.data, data);
        this.emitChanges('model:updated', this.data);
    }
}