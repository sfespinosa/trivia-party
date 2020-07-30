class UsersController < ApplicationController
    def index
        byebug
        @user = User.find_by(name: params[:name])
        # @users = User.all
        render json: @user
    end

    def show
        @user = User.find(params[:id])
        render json: @user
    end

    def create
        @user = User.new(name: params[:name])
        if @user.save
            render json: @user, only: [:id, :name]
        else
            render json: { error: @user.errors.full_messages }
        end
    end

    def destroy
        byebug
    end
    
end
