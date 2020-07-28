class UsersController < ApplicationController
    def show
        @user = User.find(params[:id])
        render json: @user
    end

    def create
        byebug
    end

    def destroy
        byebug
    end
    
end
