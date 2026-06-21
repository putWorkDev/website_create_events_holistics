CREATE TABLE attendees (
    id         BIGSERIAL PRIMARY KEY,
    event_id   BIGINT       NOT NULL REFERENCES events (id) ON DELETE CASCADE,
    user_id    BIGINT       REFERENCES users (id) ON DELETE SET NULL,
    name       VARCHAR(120) NOT NULL,
    email      VARCHAR(180) NOT NULL,
    status     VARCHAR(20)  NOT NULL DEFAULT 'GOING',
    created_at TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT uq_attendee_event_email UNIQUE (event_id, email)
);

CREATE INDEX idx_attendees_event ON attendees (event_id);
CREATE INDEX idx_attendees_user ON attendees (user_id);
