class User < ApplicationRecord
    has_many :scores
    has_many :lists, through: :scores
    validates :name, uniqueness: true
    validates :name, presence: true
    
end
