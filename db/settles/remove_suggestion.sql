DELETE FROM suggestions
WHERE suggestion = $1 AND user_id = $2 AND settle_id = $3;
