INSERT INTO users (email, name, hash)
VALUES ($1,$2, $3)
RETURNING *;