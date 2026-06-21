CREATE TABLE categories (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL UNIQUE,
    slug        VARCHAR(120)  NOT NULL UNIQUE,
    description VARCHAR(500),
    color       VARCHAR(20)   NOT NULL DEFAULT '#16a34a',
    created_at  TIMESTAMP     NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_slug ON categories (slug);

INSERT INTO categories (name, slug, description, color) VALUES
    ('Yoga & Movement', 'yoga-movement', 'Gentle flows, vinyasa and mindful movement sessions.', '#16a34a'),
    ('Meditation', 'meditation', 'Guided meditation and breathwork gatherings.', '#0d9488'),
    ('Wellness Workshops', 'wellness-workshops', 'Hands-on workshops for holistic living.', '#ca8a04'),
    ('Sound Healing', 'sound-healing', 'Sound baths and vibrational therapy experiences.', '#d97706'),
    ('Community', 'community', 'Retreats, circles and community get-togethers.', '#65a30d');
