-- Demo admin user (password: Demo@1234)
INSERT INTO vault_users (id, username, password_hash, role)
VALUES (
    gen_random_uuid(),
    'demo',
    '$argon2id$v=19$m=65536,t=3,p=1$AAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'ROLE_ADMIN'
) ON CONFLICT DO NOTHING;
