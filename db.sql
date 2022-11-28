create database WEB_MIDTERM;
use WEB_MIDTERM;
create table User (
	username char(50),
    password char(250),
    level int default 0,
    state int default 0,
    score int default 0,
    primary key (username)
);
create table history (
	id int auto_increment,
    username char(50),
    date char(50),
    level int,
    state int,
    score int,
    primary key (id),
    foreign key (username) references User(username)
);

alter table history auto_increment = 1010
drop table User

update User set level = 0 where username = 'khapham'

insert into history (username, date, level, state) values ('khapham', NOW(), 5, 5)

select * from user
select * from history where username = 'khapham' ORDER BY id DESC limit 2
delete from history where username = 'khapham'
update User set level = 3, state = 2, score=100 where username = 'khapham'