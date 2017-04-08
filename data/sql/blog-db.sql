CREATE TABLE blog.user (
    uid int AUTO_INCREMENT primary key not null,
    uname varchar(100) not null,
    password varchar(255) not null,
    email varchar(255) not null,
    avatar varchar(255) not null,
    gender varchar(1),
    role tinyint not null default 1,
    signupdate timestamp not null,
    hash varchar(255) not null,
    active boolean not null default 0
) ENGINE=InnoDB;


CREATE TABLE blog.book (
    bid int AUTO_INCREMENT primary key not null,
    author int not null,
    state tinyint not null default 0,
    title varchar(255) not null,
    createtime timestamp DEFAULT CURRENT_TIMESTAMP,
    abandontime timestamp DEFAULT 0,
    foreign key (author)
        references user(uid)
        on delete cascade
) ENGINE=InnoDB;


CREATE TABLE blog.article (
    aid int AUTO_INCREMENT primary key not null,
    author int not null,
    frombook int not null,
    published tinyint not null default 0,
    abandoned tinyint not null default 0,
    title varchar(255) not null,
    content longtext not null,
    createtime timestamp DEFAULT CURRENT_TIMESTAMP,
    lastedittime timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 全自动，不用理会
    publishtime timestamp DEFAULT 0,
    abandontime timestamp DEFAULT 0,
    clicked int not null default 0,
    collected int not null default 0,
    loved int not null default 0,
    tag varchar(255),
    foreign key (author)
        references user(uid),
        -- on delete cascade    
    foreign key (frombook)
        references book(bid)
        on delete cascade
) ENGINE=InnoDB;

-- 关于上述 timestamp : https://dev.mysql.com/doc/refman/5.7/en/timestamp-initialization.html

CREATE TABLE blog.image (
    i tinyint AUTO_INCREMENT not null,
    articleid int not null,
    url varchar(255) not null,
    -- description varchar(255),
    lastuploadtime timestamp not null,
    foreign key (articleid) 
        references article(aid) 
        on delete cascade,
    primary key (articleid, i)
) ENGINE=MyISAM;

-- You need to use InnoDB storage engine, he default MyISAM storage engine not support foreign keys relation.
-- More see: http://stackoverflow.com/questions/511361/how-do-i-use-on-delete-cascade-in-mysql

-- set `image` with engine MyISAM to make i Auto_Increment
-- More see: http://stackoverflow.com/questions/11099906/mysql-multiple-primary-keys-and-auto-increment

# image used to be type 'longblob'