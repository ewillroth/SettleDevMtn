INSERT INTO suggestions (user_id, settle_id, suggestion)
VALUES ($1, $2, $3);

INSERT INTO suggestions (user_id, settle_id, suggestion)
VALUES ($1, $2, $4);

INSERT INTO suggestions (user_id, settle_id, suggestion)
VALUES ($1, $2, $5);

UPDATE user_settles 
SET done = 'true'
WHERE user_id = $1 AND settle_id = $2;