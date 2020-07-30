class Score < ApplicationRecord
  belongs_to :user, dependent: :destroy
  belongs_to :list, dependent: :destroy

  def user_name
    self.user.name
  end
  
end
