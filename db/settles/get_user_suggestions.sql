SELECT * FROM suggestions
WHERE user_id = $1 AND settle_id = $2;