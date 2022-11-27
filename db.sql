create database WEB_MIDTERM;
use WEB_MIDTERM;
create table User (
	username char(50),
    password char(250),
    level int default 0,
    state int default 0,
    primary key (username)
);
create table history (
	id int auto_increment,
    username char(50),
    date char(50),
    level int,
    state char(5),
    primary key (id),
    foreign key (username) references User(username)
);

alter table history auto_increment = 1010

	select * from User;

update User set level = 0 where username = 'khapham'
