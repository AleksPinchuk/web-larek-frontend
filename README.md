# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Ссылка на проект: [https://github.com/AleksPinchuk/web-larek-frontend](https://github.com/AleksPinchuk/web-larek-frontend)

Структура проекта:
- src/ — исходные файлы проекта
- src/pages/Catalog — папка с классом страницы и карточек
- src/widgets — папка с компонентами представления
- src/shared — папка с базовым кодом
- src/entities/Catalog — папка с компонентом модели данных и API 

Важные файлы:
- index.html — HTML-файл главной страницы
- src/index.ts — точка входа приложения
- src/types/index.ts — файл с типами
- src/shared/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/shared/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
### **Описание проекта**  

Этот проект представляет собой веб-приложение интернет-магазина,в котором пользователи могут просматривать каталог товаров, добавлять их в корзину, оформлять заказы и получать дополнительную информацию о продуктах.  

В основе архитектуры приложения лежит паттерн проектирования **MVP (Model-View-Presenter)**. Каждый слой включает в себя соответствующие классы, описанные ниже. Взаимодействие между слоями реализовано через событийную модель и вызовы методов. Однако, в отличие от классической реализации MVP, слой **Presenter** не вынесен в отдельный класс, а встроен в основной скрипт приложения (`index.ts`). Это позволяет эффективно управлять логикой взаимодействия между компонентами.

Вот обновленный раздел `README.md` без примеров:  

## 📌 **Базовые типы (`src/types/index.ts`)**  

### ** Тип `IProductItem`**  
Описывает структуру товара в каталоге.  

**Поля:**  
- `id: string` — уникальный идентификатор товара  
- `title: string` — название товара  
- `description: string` — описание  
- `image: string` — ссылка на изображение  
- `category: string` — категория товара  
- `price: number` — стоимость  
- `inBasket: boolean` — флаг, указывающий, добавлен ли товар в корзину  
- `basketIndex: number` — индекс товара в корзине  

---

### ** Тип `IOrderAddress`**  
Описывает адрес и способ оплаты при оформлении заказа.  

**Поля:**  
- `payment: string` — способ оплаты  
- `address: string` — адрес доставки  

---

### ** Тип `IOrderContacts`**  
Описывает контактные данные покупателя.  

**Поля:**  
- `email: string` — электронная почта  
- `phone: string` — номер телефона  

---

### ** Тип `IOrderForm`**  
Объединяет **`IOrderAddress`** и **`IOrderContacts`**, представляя форму заказа.  

---

### ** Тип `IOrder`**  
Описывает структуру заказа.  

**Поля:**  
- `payment: string` — способ оплаты  
- `address: string` — адрес доставки  
- `email: string` — электронная почта  
- `phone: string` — номер телефона  
- `items: string[]` — массив идентификаторов товаров  
- `total: number` — итоговая сумма заказа  

---

### ** Тип `IOrderResult`**  
Описывает результат оформления заказа.  

**Варианты:**  
- Успешное оформление (`id` заказа и `total` сумма).  
- Ошибка (`error` сообщение).  

---

### **  Тип `FormErrors`**  
Описывает возможные ошибки в форме заказа.  

**Формат:**  
- Ключи — поля заказа  
- Значения — текст ошибки (если есть)  

---

### ** Тип `IAppState`**  
Глобальное состояние приложения.  

**Поля:**  
- `catalog: IProductItem[]` — массив товаров каталога  
- `basket: IProductItem[]` — массив товаров в корзине  
- `order: IOrder | null` — текущий заказ (или `null`, если заказа нет)  
- `formErrors: FormErrors` — ошибки формы заказа  

## **Компоненты модели данных (`src/entities/Catalog`)**  

### **Класс `CatalogState`**  
`CatalogState` — это основной класс состояния каталога, который управляет товарами, корзиной и заказами. Он наследуется от базовой модели `Model<IAppState>` и реализует ключевые методы для работы с данными.  

---

### **Основные свойства**  

- `catalog: IProductItem[]` — массив товаров каталога  
- `basket: IProductItem[]` — массив товаров, добавленных в корзину  
- `order: IOrder` — объект текущего заказа  
- `preview: string` — идентификатор товара, выбранного для предпросмотра  
- `formErrors: FormErrors` — ошибки, связанные с оформлением заказа  

---

### **Основные методы**  

#### **Управление каталогом**  
- `setCatalog(items: IProductItem[])` — обновляет список товаров в каталоге и отправляет событие `items:changed`  

#### **Работа с корзиной**  
- `addToBasket(item: IProductItem)` — добавляет товар в корзину, помечая его как `inBasket`  
- `removeFromBasket(item: IProductItem)` — удаляет товар из корзины  
- `getTotalBasketPrice(): number` — вычисляет общую стоимость товаров в корзине  
- `getBasketItemsCount(): number` — возвращает количество товаров в корзине  
- `clearBasket()` — очищает корзину и сбрасывает флаги `inBasket` у товаров  

#### **Работа с предпросмотром товара**  
- `setPreview(item: IProductItem)` — устанавливает товар для предпросмотра и отправляет событие `preview:changed`  

#### **Оформление заказа**  
- `setOrderField(field: keyof IOrderForm, value: string)` — обновляет данные заказа (адрес, email, телефон, способ оплаты)  
- `validateOrder()` — проверяет корректность заполнения формы заказа и обновляет список ошибок  
- `resetOrder()` — сбрасывает данные текущего заказа  


## **Взаимодействие с сервером (`src/shared/api`)**  

### **Класс `Methods`**  
`Methods` — это класс для работы с API, который наследуется от `Api` и отвечает за взаимодействие с сервером. Он позволяет загружать список товаров и отправлять заказы.  

---

### **Основные свойства**  

- `cdn: string` — базовый URL для загрузки изображений товаров  
- `baseUrl: string` — базовый URL API (унаследовано от `Api`)  
- `options?: RequestInit` — настройки запросов (унаследовано от `Api`)  

---

### **Основные методы**  

#### **Получение списка товаров**  
```ts
getAllProducts(): Promise<IProductItem[]>
```
- Отправляет GET-запрос к `/product` для получения списка товаров  
- Преобразует массив товаров, добавляя полный путь к изображению (`cdn + item.image`)  
- Устанавливает флаг `inBasket: false` для всех товаров  
- Возвращает обновленный массив товаров  

#### **Создание заказа**  
```ts
createOrder(order: IOrder): Promise<IOrder>
```
- Отправляет POST-запрос к `/order`, передавая объект заказа  
- Ожидает ответ от сервера с подтвержденными данными заказа  
- Возвращает полученный объект заказа  

### **Компоненты представления (View)**

---

#### **Компонент `Basket`**
Отображает корзину покупок, включая список товаров, общую сумму и кнопку для перехода к оформлению заказа.

- **Методы**:
  - `set items`: обновляет список товаров в корзине.
  - `isValid`: активирует или деактивирует кнопку в зависимости от наличия товаров в корзине.
  - `set total`: обновляет отображение общей стоимости корзины.

---

#### **Компонент `OrderFormAddress`**
Отображает форму для ввода данных о заказе, таких как адрес и способ оплаты. Пользователь выбирает способ оплаты, и это обновляет состояние формы.

- **Методы**:
  - `setPayment`: обновляет выбранный способ оплаты и передает данные в состояние формы.

---

#### **Компонент `OrderFormContacts`**
Отображает форму для ввода контактных данных пользователя, таких как email и телефон.

- **Методы**:
  - Обработка ввода данных и передачу изменений в состояние формы.

---

#### **Компонент `Success`**
Отображает сообщение об успешном оформлении заказа, включая сумму, которую списали с пользователя.

- **Методы**:
  - `set total`: обновляет текст с информацией о списанной сумме.

---

#### **Компонент `ProductCard`**
Отображает карточку товара, включая название, цену, описание, категорию и изображение. Также включает кнопку для добавления товара в корзину.

- **Методы**:
  - `set title`: обновляет название товара.
  - `set price`: обновляет цену товара.
  - `set category`: обновляет категорию товара.
  - `set buttonText`: обновляет текст на кнопке.
  - `set image`: обновляет изображение товара.
  - `set description`: обновляет описание товара (массив строк или строка).
  - `set basketIndex`: обновляет индекс товара в корзине.

---

#### **Компонент `Catalog`**
Отображает каталог товаров с возможностью переключения количества товаров в корзине и блокировки интерфейса при загрузке данных.

- **Методы**:
  - `set counter`: обновляет отображение количества товаров в корзине.
  - `set catalog`: обновляет список товаров в каталоге.
  - `set locked`: блокирует или разблокирует интерфейс каталога.

---

#### **Компонент `Modal`**
Отображает модальное окно, которое можно открыть и закрыть, и позволяет заменить его содержимое.

- **Методы**:
  - `set content`: обновляет содержимое модального окна.
  - `open`: открывает модальное окно.
  - `close`: закрывает модальное окно.
  - `render`: рендерит модальное окно и открывает его.

---

#### **Компонент `Form`**
Обрабатывает взаимодействие с формой, отслеживает изменения полей, валидацию и отправку формы.

- **Методы**:
  - `onInputChange`: отслеживает изменения в полях формы и отправляет события.
  - `set valid`: активирует или деактивирует кнопку отправки формы в зависимости от ее валидности.
  - `set errors`: отображает ошибки формы.
  - `render`: рендерит форму с текущим состоянием.


