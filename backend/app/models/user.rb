class User < ApplicationRecord
    has_many :scores
    has_many :lists, through: :scores
    validation :name, uniqueness: true
    
end
