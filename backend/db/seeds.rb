# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# User.destroy_all
# List.destroy_all
# Score.destroy_all
# Question.destroy_all

require 'httparty'



api_url = 'https://opentdb.com/api.php?amount=10&category=14&difficulty=easy&type=multiple'
response = HTTParty.get(api_url)
questions = response.parsed_response


# list1 = List.create(title: "Sports: Messi Bedroom", category: "Sports") # cat 21
# list2 = List.create(title: "Animals", category: "Animals") # cat 27
# list3 = List.create(title: "Celebrities", category: "Celebrities") # cat 26
# list4 = List.create(title: "GK: What do you know?", category: "General Knowledge") # cat 9
# list5 = List.create(title: "Music: Beyonce Knows", category: "Music") # cat 12
list6 = List.create(title: "TV: What do you know?", category: "TV") # cat 14
# list7 = List.create(title: "Film: Quizpicable Me", category: "Film") # cat 11


questions["results"].each do |question|
    Question.create(
        question: question["question"],
        question_type: question["type"],
        category: question["category"],
        difficulty: question["difficulty"],
        correct_answer: question["correct_answer"],
        incorrect_answers: question["incorrect_answers"],
        list: list6
    )
end