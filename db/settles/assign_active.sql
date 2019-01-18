UPDATE settles 
SET active_user = $1
WHERE settle_id = $2
RETURNING *;