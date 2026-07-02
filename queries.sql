create table books(
	id serial primary key,
	author varchar(75) not NULL,
	title  varchar(250) not NULL,
	series_name varchar(150),
	cover_id varchar(50),
	date_read DATE,
	rating numeric (3,1) NOT NULL,
	review TEXT,
	created_at TIMESTAMP default CURRENT_TIMESTAMP
)

insert into books (author, title, series_name, cover_id, date_read, rating, review)
values ('Taylor Jenkins Reid',
        'Daisy Jones & The Six',
        'Series Unknown',
        8742674, 
        '2026-07-02', 
        8.5, 
        'its a captivating, 1970s-style oral history Review: Daisy Jones & the Six by Taylor Jenkins Reid following the meteoric rise and abrupt split of a fictional rock band. 
        Written uniquely as an interview transcript, it is widely thought to be inspired by the turbulent dynamic of Fleetwood Mac'
        )