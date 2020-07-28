class CreateQuestions < ActiveRecord::Migration[6.0]
  def change
    create_table :questions do |t|
      t.string :question
      t.string :question_type
      t.string :category
      t.string :difficulty
      t.string :correct_answer
      t.string :incorrect_answers, array: true, default: []
      t.belongs_to :list, null: false, foreign_key: true

      t.timestamps
    end
  end
end
