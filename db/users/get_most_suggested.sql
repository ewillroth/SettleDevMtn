SELECT suggestion, COUNT(*) 
FROM suggestions 
WHERE user_id = $1 
GROUP BY suggestion 
ORDER BY COUNT(*) DESC 
LIMIT 1;