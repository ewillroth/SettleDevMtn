UPDATE users
SET profilepic = $1
WHERE user_id = $2
RETURNING profilepic;