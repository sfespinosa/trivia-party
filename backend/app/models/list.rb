class List < ApplicationRecord
    has_many :scores
    has_many :questions
    has_many :users, through: :scores
end
