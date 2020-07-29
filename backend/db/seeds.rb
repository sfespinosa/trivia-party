# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require 'httparty'



api_url = 'https://opentdb.com/api.php?amount=10&category=26&difficulty=medium&type=multiple'
response = HTTParty.get(api_url)
questions = response.parsed_response


# list1 = List.create(title: "Sports", category: "Sports") # cat 21
# list2 = List.create(title: "Animals", category: "Animals") # cat 27
# list3 = List.create(title: "Celebrities", category: "Celebrities") # cat 26

questions["results"].each do |question|
    Question.create(
        question: question["question"],
        question_type: question["type"],
        category: question["category"],
        difficulty: question["difficulty"],
        correct_answer: question["correct_answer"],
        incorrect_answers: question["incorrect_answers"],
        list: List.find(3)
    )
end