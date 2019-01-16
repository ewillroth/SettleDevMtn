UPDATE user_settles 
SET suggestion1 = $1,
suggestion2 = $2,
suggestion3 = $3,
done = true
WHERE user_id=($4) AND settle_id=($5);