-- Создание таблиц для барбершопа Боря Брей

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    bonus_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица салонов
CREATE TABLE IF NOT EXISTS salons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    phone VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    working_hours VARCHAR(255) DEFAULT 'Ежедневно: 9:00 - 21:00',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица мастеров
CREATE TABLE IF NOT EXISTS masters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    salon_id INTEGER REFERENCES salons(id),
    rating DECIMAL(3, 2) DEFAULT 5.0,
    specialization TEXT,
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица услуг
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    duration_minutes INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица бронирований
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    salon_id INTEGER REFERENCES salons(id),
    master_id INTEGER REFERENCES masters(id),
    service_id INTEGER REFERENCES services(id),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'upcoming',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица акций
CREATE TABLE IF NOT EXISTS promotions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(50),
    discount_value VARCHAR(50),
    valid_until DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица истории бонусов
CREATE TABLE IF NOT EXISTS bonus_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    points INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_masters_salon ON masters(salon_id);

-- Добавление тестовых данных

-- Салоны
INSERT INTO salons (name, address, phone) VALUES
('Боря Брей - Центр', 'ул. Ленина, 45', '+7 (8482) 555-001'),
('Боря Брей - Автозаводский', 'ул. Южное шоссе, 12', '+7 (8482) 555-002');

-- Услуги
INSERT INTO services (name, price, duration_minutes) VALUES
('Стрижка', 1200, 45),
('Борода', 800, 30),
('Стрижка + Борода', 1800, 60),
('Королевское бритьё', 1500, 50),
('Детская стрижка', 800, 30),
('Укладка', 500, 20);

-- Мастера
INSERT INTO masters (name, salon_id, rating, specialization) VALUES
('Антон Борисов', 1, 4.9, 'Классические стрижки, моделирование бороды'),
('Дмитрий Волков', 1, 4.8, 'Современные стрижки, бритьё'),
('Игорь Смирнов', 2, 5.0, 'Барбер-стилист, королевское бритьё'),
('Максим Петров', 2, 4.7, 'Классические и модные стрижки');

-- Акции
INSERT INTO promotions (title, description, discount_type, discount_value, valid_until) VALUES
('Новогодняя акция', 'Стрижка + укладка по специальной цене', 'percentage', '-20%', '2026-01-31'),
('Приведи друга', 'Получи 500 бонусных баллов за каждого друга', 'bonus', '+500', '2026-12-31'),
('Первое посещение', 'Скидка 15% на первую стрижку', 'percentage', '-15%', '2026-12-31');