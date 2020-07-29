class QuestionsController < ApplicationController
    def create
        @question = Question.create(question: params[:question], question_type: params[:question_type], category: params[:category], difficulty: params[:difficulty], correct_answer: params[:correct_answer], incorrect_answers: params[:incorrect_answers], list_id: params[:list_id])
        render json: @question.list
    end
end
