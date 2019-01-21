DELETE FROM suggestions
WHERE suggestion_id IN (
	SELECT suggestion_id FROM suggestions
	WHERE suggestion = $1 AND settle_id = $2
	LIMIT 1);
