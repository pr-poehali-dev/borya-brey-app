-- Добавление полей для клиентов без регистрации
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS client_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS client_phone VARCHAR(50);