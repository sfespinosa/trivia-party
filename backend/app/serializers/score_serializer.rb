class ScoreSerializer < ActiveModel::Serializer
  attributes :id, :score, :user_name, :user_id, :list_id
end
