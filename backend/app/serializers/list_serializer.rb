class ListSerializer < ActiveModel::Serializer
  attributes :id, :title, :category, :questions, :scores
end
