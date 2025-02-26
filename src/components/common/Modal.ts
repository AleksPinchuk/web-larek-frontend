import { IEvents } from "../base/events";

// Гарда для проверки на модель
export const isModel = <T>(obj: unknown): obj is Model<T> => {
    return obj instanceof Model;
}

/**
 * Базовая модель для всех объектов с данными
 */
export abstract class Model<T> {
    // Конструктор принимает частичные данные и обработчик событий
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }

    /**
     * Сообщить всем об изменении модели
     * @param event Название события
     * @param payload Дополнительные данные для события
     */
    emitChanges(event: string, payload?: object) {
        // Используется оператор nullish coalescing для подставления пустого объекта по умолчанию
        this.events.emit(event, payload ?? {});
    }

    // Здесь могут быть добавлены общие методы для моделей
}
