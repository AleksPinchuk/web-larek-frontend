// Интерфейс товара
interface IProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Определяем доступные способы оплаты
type PaymentType = 'online' | 'on delivery';

// Форма заказа (без суммы и списка товаров)
interface IOrderForm {
  payment: PaymentType;
  address: string;
  email: string;
  phone: string;
}

// Полный заказ (добавляем товары и сумму)
interface IOrder extends IOrderForm {
  items: IProductItem[]; // Список товаров
  total: number; // Итоговая сумма
}

// Корзина покупателя
interface IBasket {
  items: IProductItem[]; // Список товаров в корзине
  total: number; // Итоговая стоимость корзины
}

// Результат оформления заказа
interface IOrderResult {
  id: string; // Уникальный ID заказа
  total: number; // Итоговая сумма заказа
}
