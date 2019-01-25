UPDATE users
SET name = $2
WHERE user_id = $1
RETURNING name;