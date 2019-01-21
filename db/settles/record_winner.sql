UPDATE settles
SET winning_suggestion = $1,
winner_id = $2
WHERE settle_id = $3;