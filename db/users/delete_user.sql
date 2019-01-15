DELETE FROM user_settles
WHERE user_id = $1;

DELETE FROM settles
WHERE creator_id = $1;

DELETE FROM friends
WHERE user_id1 = $1 OR user_id2 = $1;

DELETE FROM users
WHERE user_id = $1;
