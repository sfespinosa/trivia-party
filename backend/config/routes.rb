Rails.application.routes.draw do
  resources :scores, only: [:index, :show, :create, :update]
  resources :questions, only: [:create]
  resources :lists, only: [:index, :show, :create]
  resources :users, only: [:show, :create, :delete]
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
