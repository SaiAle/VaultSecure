CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE vault_users (
    id              UUID PRIMARY KEY,
    username        VARCHAR(64)  NOT NULL UNIQUE,
    password_hash   TEXT         NOT NULL,
    role            VARCHAR(32)  NOT NULL DEFAULT 'ROLE_USER',
    totp_secret     VARCHAR(256),
    totp_enabled    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE secrets (
    id              UUID PRIMARY KEY,
    name            VARCHAR(128) NOT NULL,
    category        VARCHAR(64),
    encrypted_value TEXT         NOT NULL,
    iv              VARCHAR(64)  NOT NULL,
    salt            VARCHAR(64)  NOT NULL,
    owner_username  VARCHAR(64)  NOT NULL,
    version         INT          NOT NULL DEFAULT 1,
    active          BOOLEAN      NOT NULL DEFAULT TRUE,
    expires_at      TIMESTAMPTZ,
    rotated_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id          BIGSERIAL    PRIMARY KEY,
    event_type  VARCHAR(64)  NOT NULL,
    username    VARCHAR(64)  NOT NULL,
    description TEXT         NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_secrets_owner  ON secrets(owner_username, active);
CREATE INDEX idx_audit_username ON audit_logs(username, created_at DESC);
