UPDATE user_settles
SET user_id = (SELECT user_id FROM users WHERE email = $1)
WHERE user_id = $2;

UPDATE settles
SET creator_id = (SELECT user_id FROM users WHERE email = $1)
WHERE creator_id = $2;