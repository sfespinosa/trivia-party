class ScoresController < ApplicationController
    def index
        if params[:list_id] && params[:user_id]
            @scores = Score.find_by(user_id: params[:user_id], list_id: params[:list_id])
        elsif params[:list_id]
            @scores = Score.all.find_all { |score| score.list_id == params[:list_id].to_i }
        elsif params[:user_id]
            @scores = Score.all.find_all { |score| score.user_id == params[:user_id].to_i }
        else
            @scores = Score.all
        end
        render json: @scores
    end

    def show
        @score = Score.find(params[:id])
        render json: @score
    end

    def create
        @score = Score.create(score: params[:score], user_id: params[:user_id], list_id: params[:list_id])
        render json: @score
    end

    def update
        @score = Score.find(params[:id])
        @score.update(score: params[:score], user_id: params[:user_id], list_id: params[:list_id])
        render json: @score
    end
    
end
