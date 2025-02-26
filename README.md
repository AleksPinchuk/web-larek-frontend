# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

Веб-ларек

Фронтенд-проект, реализованный с использованием HTML, SCSS, TypeScript и Webpack. Использует архитектурный паттерн MVP (Model-View-Presenter).

🚀 Стек технологий

HTML – разметка

SCSS – стили

TypeScript – логика

Webpack – сборка

📂 Структура проекта

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

⚡ Установка и запуск

npm install
npm run start

🔨 Сборка проекта

npm run build

🎭 Архитектурный шаблон MVP

Разделяет приложение на три слоя:

Model – данные и бизнес-логика

View – интерфейс

Presenter – связь Model и View

🔑 Интерфейсы

interface IProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

interface IOrderResult {
  id: string;
  total: number;
}

interface IAppState {
  catalog: IProductItem[];
  basket: string[];
  preview: string | null;
  contact: IContactForm | null;
  delivery: IDeliveryForm | null;
  order: IOrder | null;
}

📌 Основные классы

Model – управление данными

Component – работа с DOM

Basket – управление корзиной

Form – обработка форм

Modal – модальные окна

Page – управление контентом

API – работа с сервером

📬 Контакты

Разработчик: АлександрПроект на GitHub: web-larek-frontend