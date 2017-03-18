require "bundler"
Bundler.require

require "zlib"

require "./app/models/user"
require "./app/models/game"

configure :development do
   set :database, "sqlite3:db/database.db"
end
