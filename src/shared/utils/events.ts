type EventName = string | RegExp;
type Subscriber<T = unknown> = (data: T) => void; // Теперь принимает параметр
type EmitterEvent = {
    eventName: string,
    data: unknown
};

export interface IEvents {
    on<T extends object>(event: EventName, callback: Subscriber<T>): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): Subscriber<T>;
}

export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    on<T extends object>(eventName: EventName, callback: Subscriber<T>) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback as Subscriber);
    }

    off(eventName: EventName, callback: Subscriber) {
        const subscribers = this._events.get(eventName);
        if (subscribers) {
            subscribers.delete(callback);
            if (subscribers.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    emit<T extends object>(eventName: string, data?: T) {
        this._events.forEach((subscribers, name) => {
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }

    onAll(callback: Subscriber<EmitterEvent>) {
        this.on("*", callback);
    }

    offAll() {
        this._events = new Map<string, Set<Subscriber>>();
    }

    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {})
            });
        };
    }
}
