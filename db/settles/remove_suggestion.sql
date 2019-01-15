UPDATE user_settles
SET $1 = null
WHERE settle_id = $2 AND user_id = $3;
