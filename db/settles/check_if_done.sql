SELECT done FROM user_settles
WHERE settle_id = $1 AND user_id = $2;