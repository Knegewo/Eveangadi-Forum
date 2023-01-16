const mysql = require("mysql");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB,
   connectionLimit: 10,
});

let registration = `CREATE TABLE if not exists registration(
    user_id int auto_increment,
    user_name varchar(255) not null,
    user_email varchar(255) not null,
    user_password varchar(255) not null,
    PRIMARY KEY (user_id),
    UNIQUE KEY (user_name)
    )`;
let profile = `CREATE TABLE if not exists profile(
    user_profile_id int auto_increment,
    user_id int not null,
    first_name varchar(255) not null,
    last_name varchar(255) not null,        
    PRIMARY KEY (user_profile_id),
    FOREIGN KEY (user_id) REFERENCES registration(user_id)
)`;

let questions = `CREATE TABLE if not exists questions(
    question_id int auto_increment,
    question varchar(255) not null,
    question_description varchar(255) not null,
    user_id int not null,
    post_id int not null,
    PRIMARY KEY (question_id),
    FOREIGN KEY (user_id) REFERENCES registration(user_id),
    UNIQUE KEY (post_id)
    )`;

let answers = `CREATE TABLE if not exists answers(
        answer_id int auto_increment,
        answer varchar(255) not null,
        user_id int not null,
        question_id int not null,
        PRIMARY KEY (answer_id),
        FOREIGN KEY (user_id) REFERENCES registration(user_id),
        FOREIGN KEY (question_id) REFERENCES questions(question_id)
        )`;

pool.query(registration, (err, results) => {
  if (err) {console.log(err)};
  console.log("registration table created");
});
pool.query(profile, (err, results) => {
  if (err) {console.log(err)};
  console.log("profile table created");
});

pool.query(questions, (err, results) => {
  if (err) {console.log(err)};
  console.log("questions table created");
});
pool.query(answers, (err, results) => {
  if (err) {console.log(err)};
  console.log("answers table created");
});

module.exports = pool;



