var board = ["", "", "", "", "", "", "", "", ""]
var winner = "";
var gameOver = false;
var humanMove = true;
function setup() {
   frameRate(60);
   var canvas = createCanvas(1000, 1000);
   canvas.parent('canvas-container');
}

function draw() {
  var x = 75;
  var y = 0;
  // createCanvas(1000, 1000);
  line(250, 100, 250, 700);
  line(450, 100, 450, 700);
  line(50, 300, 650, 300);
  line(50, 500, 650, 500);
  textSize(200);
  for (var i = 0; i < board.length; i++) {
     y = (1 + Math.floor(i/3)) * 200 + 75;
     x = (i % 3 * 200 + 75);
     text(board[i], x, y);
  }
  textSize(20);
  text(winner, 300, 50)
}

var findColumn = function() {
   if(mouseX<250&&mouseX>50) {
      col = 0;
   } else if(mouseX>250&&mouseX<450) {
      col = 1;
   } else if(mouseX>450&&mouseX<650) {
      col = 2;
   } else {
      col = 4;
   }
   return col;
}

var findRow = function() {
   if(mouseY<300&&mouseY>100) {
      row = 0;
   } else if(mouseY>300&&mouseY<500) {
      row = 1;
   } else if(mouseY>500&&mouseY<700) {
      row = 2;
   } else {
      row = 4;
   }
   return row;
}

function mousePressed() {
   var col, row = 0;
   var col = findColumn();
   var row = findRow();
   var onBoard = row < 4 && col < 4;
   if(!gameOver && humanMove && onBoard) {
      humanMove = false;
      var space = row*3 + col;
      if(board[space] != "X" && board[space] != "O"){
         board[space] = "X";
         if(win()) {
            gameOver = true;
            winner = "Player Wins"
            $.ajax({
               url: "/record_win",
               method: "post",
               data: {winner: winner},
               success: function(response) {
                  $('#user_score').text(parseInt($('#user_score').text())+1)
               }
            })
         }
         if(!gameOver) {
            setTimeout(function(){
               computerMove();
            },500);
         }
      }
   }
}

var computerMove = function() {
   var openSpaces = []
   for (var i = 0; i < board.length; i++) {
      if(board[i] == "") {
         openSpaces.push(i)
      }
   }
   var blockMove = -1;
   var winMove = -1;
   for (var i = 0; i < openSpaces.length; i++) {

      board[openSpaces[i]] = "X"
      if(win()) {
         blockMove = openSpaces[i];
         board[openSpaces[i]] = ""
      }

      board[openSpaces[i]] = "O"
      if(win()) {
         winMove = openSpaces[i];
         winner = "Computer Wins"
         gameOver = true;
         $.ajax({
            url: "/record_win",
            method: "post",
            data: {winner: winner},
            success: function(response) {
               $('#computer_score').text(parseInt($('#computer_score').text())+1)
            }
         })
         break;
      }
      board[openSpaces[i]] = ""
   }
   if(winMove == -1 && blockMove == -1) {
      move = openSpaces[Math.floor(Math.random() * openSpaces.length)]
   } else if(winMove != -1) {
      move = winMove
   } else if(blockMove != -1){
      move = blockMove
   }
   board[move] = "O"
   humanMove = true;
}


var threeInARow = function(place1, place2, place3) {
   return board[place1] != "" && board[place1] == board[place2] && board[place1] == board[place3]
}

var verticalWin = function() {
   if(threeInARow(0, 3, 6) || threeInARow(1, 4, 7) || threeInARow(2, 5, 8)){
      return true;
   }
   else{
      return false;
   }
}

var horizontalWin = function() {
   if(threeInARow(0, 1, 2) || threeInARow(3, 4, 5) || threeInARow(6, 7, 8)) {
      return true;
   }
   else{
      return false;
   }
}

var diagonalWin = function() {
   if(threeInARow(0, 4, 8) || threeInARow(2, 4, 6)) {
      return true;
   }
   else{
      return false;
   }
}

var win = function() {
   var vert = verticalWin();
   var hori = horizontalWin();
   var diag = diagonalWin();
   return vert || hori || diag
}
