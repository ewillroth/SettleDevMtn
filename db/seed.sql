-- USERS
CREATE TABLE users (
	user_id serial PRIMARY KEY NOT NULL,
	email varchar(200) NOT NULL,
	name varchar(200) NOT NULL, 
	hash varchar(200) NOT NULL,
	profilepic text DEFAULT 'https://image.flaticon.com/icons/svg/118/118781.svg'
	);

INSERT INTO users (email, name, profilepic)
VALUES ('fakeuser123@gmail.com','fakey mcfakerson','https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60');

INSERT INTO users (email, name)
VALUES ('fakeuser123@gmail.com','fakey mcfakerson');

-- SETTLES

CREATE TABLE settles (
settle_id serial PRIMARY KEY NOT NULL,
creator_id integer REFERENCES users(user_id),
winning_suggestion varchar(200),
stage varchar(10) DEFAULT 'inactive'
);

INSERT INTO settles (creator_id, winning_suggestion, stage)
VALUES (1,'Taco Bell','inactive')

-- FRIENDS

CREATE TABLE friends (
user_id1 integer REFERENCES users(user_id),
user_id2 integer REFERENCES users(user_id),
pending boolean DEFAULT true,
PRIMARY KEY (user_id1,user_id2)
);

INSERT INTO friends (user_id1, user_id2)
VALUES (1,2);

-- USER_SETTLES

CREATE TABLE user_settles (
	user_id integer REFERENCES users(user_id), 
	settle_id integer REFERENCES settles(settle_id), 
	suggestion1 varchar(200), 
	suggestion2 varchar(200), 
	suggestion3 varchar(200), 
	PRIMARY KEY (user_id, settle_id)
);

INSERT INTO user_settles (user_id,settle_id,suggestion1,suggestion2,suggestion3)
VALUES (1,1,'Taco Bell', 'Pizza Hut', 'Waffle House'), (2,1,'Canes','Tops','Subway');

