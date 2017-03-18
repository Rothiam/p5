require './config/environment'
require "pry"


class ApplicationController < Sinatra::Base

  configure do
    set :public_folder, 'public'
    set :views, 'app/views'
    set :sessions, true
    set :session_secret, "shuffleboard"
  end

  get '/' do
     @current_user = User.find(session[:user_id]) if session[:user_id]
    erb :index
  end

  post '/new_game' do
     redirect '/'
  end

  get '/users/new' do
     @current_user = User.find(session[:user_id]) if session[:user_id]
     erb :"users/new"
  end

  post '/users' do
     user = User.create(name: params[:name])
     user.password = params[:password]
     user.save!
     session[:user_id] = user.id
     redirect "/"
  end

  post '/record_win' do
     @current_user = User.find(session[:user_id]) if session[:user_id]
     if params[:winner] == "Player Wins"
        @current_user.games << Game.create(user_id: @current_user.id, human_win: true, tie: false)
     elsif params[:winner] == "Computer Wins"
        @current_user.games << Game.create(user_id: @current_user.id, human_win: false, tie: false)
     else
        @current_user.games << Game.create(user_id: @current_user.id, human_win: false, tie: true)
     end
  end

end
