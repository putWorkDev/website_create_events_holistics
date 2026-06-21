CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(120)  NOT NULL,
    email         VARCHAR(180)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    role          VARCHAR(20)   NOT NULL DEFAULT 'USER',
    created_at    TIMESTAMP     NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users (email);

-- Default admin account. Password is "admin123" (BCrypt hashed).
INSERT INTO users (name, email, password_hash, role)
VALUES (
    'Holistics Admin',
    'admin@holistics.events',
    '$2b$10$e6ojf0o3.nswA4AS0WGoY.7OxsgphYliPptU.0Vo/p9KR..yvkdke',
    'ADMIN'
);
