
UPDATE user_settles 
SET done = 'true'
WHERE user_id = $1 AND settle_id = $2;