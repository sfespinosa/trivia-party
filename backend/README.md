# Trivia Party!

## Installation
1. Fork and clone repository.
2. Navigate into the directory where you cloned the repository.
3. Enter the command "bundle install" in the terminal.
4. Navigate to backend folder (cd backend) and run "rails db:create" in the terminal.
5. Run "rails db:migrate" in the terminal.
6. Run "rails db:seed" in the terminal for testing data.
7. Run "rails server" to begin server.
8. Run "open frontend/index.html" to view the website!

## Description
This single page application will test your knowledge on different categories. Try your best to be the high scorer on each quiz. Join in on the fun by creating your own quizzes for your friends! Perfect for your virtual game nights at home.

## Features
* Login as new user or returning user
* Select a quiz from the side menu
    - **Take quiz** - toggle between questions and select an answer from multiple choice options
    - **View quiz progress**
    - **View quiz scores** - view your score and how it compares to others who have taken the quiz
* Create a new quiz
    - **Title** 
    - **Category** 
    - **10 multiple choice questions**
* View user profile
    - **View your scores** - lists the quizzes you have taken and the score
    - **Delete user account**

## Technologies
* Ruby version: 2.6.1
* Javascript
* PostgreSQL

## Contributions
* Carly La
* Scott Espinosa
* Open Trivia API: https://opentdb.com/api_config.php
