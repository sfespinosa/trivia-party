Rails.application.routes.draw do
  resources :scores, only: [:index, :show, :create, :update]
  resources :questions, only: [:create, :index]
  resources :lists, only: [:index, :show, :create]
  resources :users, only: [:index, :show, :create, :destroy]
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
