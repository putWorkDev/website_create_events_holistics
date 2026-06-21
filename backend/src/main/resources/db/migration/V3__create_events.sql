CREATE TABLE events (
    id            BIGSERIAL PRIMARY KEY,
    title         VARCHAR(180)  NOT NULL,
    slug          VARCHAR(200)  NOT NULL UNIQUE,
    summary       VARCHAR(300),
    description   TEXT          NOT NULL,
    location      VARCHAR(255)  NOT NULL,
    image_url     VARCHAR(500),
    start_time    TIMESTAMP     NOT NULL,
    end_time      TIMESTAMP     NOT NULL,
    capacity      INTEGER       NOT NULL DEFAULT 0,
    price         NUMERIC(10,2) NOT NULL DEFAULT 0,
    published     BOOLEAN       NOT NULL DEFAULT TRUE,
    category_id   BIGINT        NOT NULL REFERENCES categories (id),
    created_by    BIGINT        REFERENCES users (id),
    created_at    TIMESTAMP     NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_category ON events (category_id);
CREATE INDEX idx_events_start_time ON events (start_time);
CREATE INDEX idx_events_published ON events (published);

INSERT INTO events (title, slug, summary, description, location, image_url, start_time, end_time, capacity, price, published, category_id, created_by)
VALUES
    ('Sunrise Vinyasa Flow', 'sunrise-vinyasa-flow',
     'Greet the day with an energising vinyasa practice.',
     'Join us for a 75-minute sunrise vinyasa flow suitable for all levels. We will move with the breath, build heat and finish with a restorative cooldown. Bring your own mat and a bottle of water.',
     'Riverside Park Pavilion, Lisbon',
     'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=60',
     now() + interval '7 days' + interval '7 hours',
     now() + interval '7 days' + interval '8 hours 15 minutes',
     30, 12.00, TRUE,
     (SELECT id FROM categories WHERE slug = 'yoga-movement'),
     (SELECT id FROM users WHERE email = 'admin@holistics.events')),
    ('Full Moon Sound Bath', 'full-moon-sound-bath',
     'Relax into deep rest with crystal singing bowls.',
     'A 90-minute immersive sound bath under the full moon. Lie back, close your eyes and let the vibrations of crystal bowls, gongs and chimes wash over you. Mats and blankets provided.',
     'The Wellness Loft, Porto',
     'https://images.unsplash.com/photo-1591291621164-2c6367723315?auto=format&fit=crop&w=1200&q=60',
     now() + interval '14 days' + interval '19 hours',
     now() + interval '14 days' + interval '20 hours 30 minutes',
     25, 18.00, TRUE,
     (SELECT id FROM categories WHERE slug = 'sound-healing'),
     (SELECT id FROM users WHERE email = 'admin@holistics.events')),
    ('Mindful Mornings Meditation', 'mindful-mornings-meditation',
     'Start your week grounded and calm.',
     'A gentle 45-minute guided meditation and breathwork session to centre yourself for the week ahead. Beginners very welcome.',
     'Community Garden Studio, Lisbon',
     'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=60',
     now() + interval '3 days' + interval '8 hours',
     now() + interval '3 days' + interval '8 hours 45 minutes',
     20, 0.00, TRUE,
     (SELECT id FROM categories WHERE slug = 'meditation'),
     (SELECT id FROM users WHERE email = 'admin@holistics.events'));
