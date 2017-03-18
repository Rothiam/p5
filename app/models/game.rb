require './config/environment.rb'

class Game < ActiveRecord::Base
   belongs_to :user
end
