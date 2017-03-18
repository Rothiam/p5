class Games < ActiveRecord::Migration
  def change
     create_table :games do |t|
        t.integer :user_id
        t.boolean :human_win
        t.boolean :tie
     end
  end
end
