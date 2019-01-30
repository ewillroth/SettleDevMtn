UPDATE user_settles
SET user_id = (SELECT user_id FROM users WHERE email = $1)
WHERE user_id = $2;