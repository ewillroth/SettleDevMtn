SELECT * FROM user_settles 
INNER JOIN users ON user_settles.user_id = users.user_id
WHERE settle_id = $1
ORDER BY users.user_id ASC;