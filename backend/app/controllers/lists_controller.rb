class ListsController < ApplicationController
    def index
        @lists = List.all
        render json: @lists
    end

    def show
        @list = List.find(params[:id])
        render json: @list
    end

    def create
        @list = List.create(title: params[:title], category: params[:category])
        render json: @list
    end
end
