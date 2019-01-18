SELECT * FROM settles
JOIN user_settles ON settles.settle_id = user_settles.settle_id
WHERE user_settles.user_id = $1 AND settles.stage = 'new'
OR user_settles.user_id = $1 AND settles.stage = 'inactive'
OR user_settles.user_id = $1 AND settles.stage = 'active';