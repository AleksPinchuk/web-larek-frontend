# Проектная работа Веб-ларек

Фронтенд-проект, реализованный с использованием **HTML, SCSS, TypeScript и Webpack**. Использует архитектурный паттерн **MVP** (Model-View-Presenter).

## 🚀 Стек технологий
- **HTML** – разметка
- **SCSS** – стили
- **TypeScript** – логика
- **Webpack** – сборка

## 📂 Структура проекта
```
├── src/          # Исходники
│   ├── components/  # Компоненты
│   ├── models/      # Модели
│   ├── views/       # Представления
│   ├── presenters/  # Презентеры
│   ├── types/       # Типы
│   ├── utils/       # Утилиты
│   ├── styles/      # Стили
├── public/       # Статика
├── dist/         # Сборка
```

## ⚡ Установка и запуск
```sh
npm install
npm run start
```

### 🔨 Сборка проекта
```sh
npm run build
```

## 🎭 Архитектурный шаблон MVP
Разделяет приложение на три слоя:
- **Model** – данные и бизнес-логика
- **View** – интерфейс
- **Presenter** – связь Model и View

## 🔑 Интерфейсы
```ts
interface IProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}
```
```ts
interface IOrderResult {
  id: string;
  total: number;
}
```
```ts
interface IAppState {
  catalog: IProductItem[];
  basket: string[];
  preview: string | null;
  contact: IContactForm | null;
  delivery: IDeliveryForm | null;
  order: IOrder | null;
}
```

## 📌 Основные классы
- `Model` – управление данными
- `Component` – работа с DOM
- `Basket` – управление корзиной
- `Form` – обработка форм
- `Modal` – модальные окна
- `Page` – управление контентом
- `API` – работа с сервером

## 📬 Контакты
Разработчик: [Александр](https://github.com/AleksPinchuk)  
Проект на GitHub: [web-larek-frontend](https://github.com/AleksPinchuk/web-larek-frontend)

