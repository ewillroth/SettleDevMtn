UPDATE user_settles 
SET done = 'false'
WHERE user_id = $1 AND settle_id = $2;