UPDATE settles
SET new = false
WHERE settle_id = $1;