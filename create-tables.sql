create table if not exists users
(
	username text not null
		constraint users_pk
			primary key,
	password text,
	hash_iterations int default 5000 not null,
	server_salt text
);

