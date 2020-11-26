create table if not exists users
(
	username text not null
		constraint users_pk
			primary key,
	password text,
	hash_iterations int default 5000 not null,
	server_salt text
);

create table if not exists leaderboard
(
    name text not null,
    timestamp int not null,
    time numeric not null,
    decimals int default 3 not null,
    constraint leaderboard_pk
        primary key (name, timestamp)
);


