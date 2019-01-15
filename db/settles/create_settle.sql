INSERT INTO settles (creator_id)
VALUES ($1)
RETURNING *;