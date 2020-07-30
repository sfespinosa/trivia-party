class User < ApplicationRecord
    has_many :scores, dependent: :destroy
    has_many :lists, through: :scores
    validates :name, uniqueness: true
    validates :name, presence: true
    
end
