# Create database script for Bettys books

# Create the database
CREATE DATABASE IF NOT EXISTS bettys_books;
USE bettys_books;

# Create the tables
CREATE TABLE IF NOT EXISTS books (id INT AUTO_INCREMENT,name VARCHAR(50),price DECIMAL(5, 2) unsigned,PRIMARY KEY(id));

CREATE TABLE users (id INT AUTO_INCREMENT,username VARCHAR(200),firstName VARCHAR(200) ,lastName VARCHAR(200) ,email VARCHAR(200) ,hashedPassword VARCHAR(200), PRIMARY KEY(id));

CREATE TABLE authors (author_id INT AUTO_INCREMENT,name VARCHAR(200), authorBio TEXT, PRIMARY KEY(author_id));

CREATE TABLE bookAuthors (author_id INT, book_id INT, FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE, FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE, PRIMARY KEY (book_id, author_id));

CREATE TABLE bookReviews (review_id INT AUTO_INCREMENT, user_id INT, book_id INT, rating TINYINT NOT NULL CHECK(rating >= 1 AND rating <= 5), textReview TEXT, dateReview TIMESTAMP DEFAULT, FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,  FOREIGN KEY (book_id) REFERENCES book(book_id) ON DELETE CASCADE, PRIMARY KEY(review_id));


# Create the app user
CREATE USER IF NOT EXISTS 'bettys_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON bettys_books.* TO ' bettys_books_app'@'localhost';
