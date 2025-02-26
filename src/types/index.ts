// Объединяем одинаковые onClick действия в один тип
type ButtonClickHandler = (event: MouseEvent) => void;

interface ICardActions {
  onClick: ButtonClickHandler;
}

interface IBasketActions {
  onClick: ButtonClickHandler;
}

// Интерфейс для товаров
export interface IProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
  inBasket: boolean;
  basketIndex: number;
}

// Объединяем адрес и контактные данные в общий интерфейс для заказа
export interface IOrderAddress {
  payment: string;
  address: string;
}

export interface IOrderContacts {
  email: string;
  phone: string;
}

// Oбъединение интерфейсов для формы заказа
export interface IOrderForm extends IOrderAddress, IOrderContacts {}

export interface IOrder extends IOrderForm {
  items: string[];
  total: number;
}

// Интерфейс для обратобки результатов заказа
export interface IOrderResult {
  result: { id: string; total: number } | { error: string };
}

// Тип для ошибок формы
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

// Основное состояние приложения
export interface IAppState {
  catalog: IProductItem[];
  basket: IProductItem[];
  order: IOrder | null;
  formErrors: FormErrors;
}