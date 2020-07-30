class Score < ApplicationRecord
  belongs_to :user
  belongs_to :list

  def user_name
    self.user.name
  end
  
  def list_title
    self.list.title
  end
end
