-- USERS
CREATE TABLE users (
	user_id serial PRIMARY KEY NOT NULL,
	email varchar(200) NOT NULL,
	name varchar(200) NOT NULL, 
	hash varchar(200) NOT NULL,
	profilepic text DEFAULT 'https://image.flaticon.com/icons/svg/118/118781.svg'
	);

-- SETTLES

CREATE TABLE settles (
settle_id serial PRIMARY KEY NOT NULL,
creator_id integer REFERENCES users(user_id),
winning_suggestion varchar(200),
winner_id integer REFERENCES users(user_id),
stage varchar(10) DEFAULT 'inactive'
);

-- FRIENDS

CREATE TABLE friends (
user_id1 integer REFERENCES users(user_id),
user_id2 integer REFERENCES users(user_id),
pending boolean DEFAULT true,
PRIMARY KEY (user_id1,user_id2)
);

-- SUGGESTIONS

CREATE TABLE suggestions (
	suggestion_id serial NOT NULL,
	settle_id integer REFERENCES settles(settle_id),
	user_id integer REFERENCES users(user_id),
	suggestion varchar(200),
	PRIMARY KEY (suggestion, settle_id)
);

--USER_SETTLES

CREATE TABLE user_settles (
    settle_id integer REFERENCES settles(settle_id),
    user_id integer REFERENCES users(user_id),
    done BOOLEAN default FALSE,
    PRIMARY KEY (user_id,settle_id)
);