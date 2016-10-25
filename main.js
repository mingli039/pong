window.onload = function(){
            var pupb;
	    var pdownb;
            var initButtons = false;
	    var phoneButton = document.getElementById('copyRight');
	    phoneButton.addEventListener('click', function(){
		initButtons = true;    
	    })
	    if(initButtons){
		var con = document.getElementById('mcnt');
                var upb = document.createElement('div');
		upb.className = "phoneButton";
	        var downb = document.createElement('div');
		downb.className = "phoneButton";
		con.appendChild(upb);
		con.appendChild(downb);
		pupb = document.getElementsByClassName('phoneButton')[0];
		pdownb = document.getElementsByClassName('phoneButton')[1];
		console.log(pupb, pdownb)
	    }
	
	window.addEventListener("keydown", function(e) {
		// space and arrow keys
	    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			e.preventDefault();
		}
	}, false);


	var WIDTH = 700;
	var HEIGHT = (WIDTH/12)*9;
	var canvas;
	var ctx;
	var keystate;

	var firstTime = 0;

	var start = function(){
		
	    //Music
	    var bg_music;
	    if(firstTime < 1){
		    bg_music = new Audio();
		    bg_music.src = 'eclipse.mp3';
		    bg_music.autoplay = true;
		    bg_music.loop = true;
	    }


	    function start_music(){
	        bg_music.play();
	    }

	    function stop_music(){
	         bg_music.pause();
	    }

	    var start_music_dom = document.getElementById('start_music');
	    var stop_music_dom = document.getElementById('stop_music');

	    start_music_dom.addEventListener('click', start_music);
	    stop_music_dom.addEventListener('click', stop_music);

		//Global Vars

		var player_score;
		var opponent_score;

		var pi = Math.PI

		var down = 38;
		var up = 40;

		var score_player = 0;
		var score_opponent = 0;

		//Objects
		var player = {
			x: null,
			y: null,
			width: 18,
			height: 85,
			speed: 5,

			update: function(){
				if(initButtons){
				pupb.addEventListener('click', function(){
					this.y += this.speed;
				})
				pdownb.addEventListener('click', function(){
					this.y -= this.speed;
				})	
				}
				if(keystate[up]){
					this.y += this.speed;
				}
				if(keystate[down]){
					this.y -= this.speed;
				}

				this.y = Math.max(Math.min(this.y, HEIGHT-this.height), 0)
			},

			draw: function(){
				ctx.fillStyle = 'orange';
				ctx.fillRect(this.x, this.y, this.width, this.height)
			}
		}

		var opponent = {
			x: null,
			y: null,
			width: 18,
			height: 85,

			update: function(){
				var desty = ball.y - (this.height - ball.side) * 0.54;

				this.y += (desty - this.y) * 0.19;
				this.y = Math.max(Math.min(this.y, HEIGHT-this.height), 0)
			},

			draw: function(){
				ctx.fillStyle = 'orange';
				ctx.fillRect(this.x, this.y, this.width, this.height)
			}
		}

		var ball = {
			x: null,
			y: null,
			side: 16,
			speed: 9,
			random: (Math.round(Math.random())),

			update: function(){
				this.x += this.vel.x;
				this.y -= this.vel.y;
				if(0 > this.y || this.y+this.side > HEIGHT){
					var offset = this.vel.y < 0 ? HEIGHT - (this.y + this.side) : 0 - this.y;
					this.y += 2*offset;
					this.vel.y *= -1;
				}

				var AABBIntersect = function(ax, ay, aw, ah, bx, by, bw, bh){
					return ax < bx+bw && ay < by+bh && bx < ax+aw && by < ay+ah;
				}

				var pdle = this.vel.x < 0 ? player : opponent;
				if(AABBIntersect(this.x, this.y, this.side, this.side, pdle.x, pdle.y, pdle.width, pdle.height)){
					this.x = pdle === player ? player.x+player.width : opponent.x - this.side;
					var n = (this.y+this.side - pdle.y)/(pdle.height+this.side);
					var phi = 0.25*pi*(2.25*n - 1); // pi / 4 = 45 degrees

					var smash = Math.abs(phi) > 0.223*pi ? 1.5 : 1
					this.vel.x = smash*(pdle===player ? 1 : -1)*this.speed*Math.cos(-phi);
					this.vel.y = smash*this.speed*Math.sin(-phi);
				}

				if(0-150 > this.x+this.side){
					score_opponent += 1;

					player.x = 10;
					player.y = (HEIGHT/2)-(player.height/2);

					opponent.x = WIDTH - opponent.width - 10;
					opponent.y = (HEIGHT/2)-(opponent.height/2);

					ball.x = (WIDTH/2)-(ball.side/2);
					ball.y = (HEIGHT/2)-(ball.side/2);

					ball.vel = {
						x: ball.speed,
						y: 0
					}
				}

				if(this.x > WIDTH+150){
					score_player += 1;

					player.x = 10;
					player.y = (HEIGHT/2)-(player.height/2);

					opponent.x = WIDTH - opponent.width - 10;
					opponent.y = (HEIGHT/2)-(opponent.height/2);

					ball.x = (WIDTH/2)-(ball.side/2);
					ball.y = (HEIGHT/2)-(ball.side/2);

					ball.vel = {
						x: ball.speed,
						y: 0
					}
				}
			},

			draw: function(){
				ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
				ctx.fillRect(this.x, this.y, this.side, this.side)
			}
		}

		player_score = {
			x: null,
			y: null,
			size: "24px",
			font: "Arial",
			color: "#0088ff",

			draw: function(){
				ctx.fillStyle = this.color;
				ctx.font = this.size + " " + this.font;
				ctx.fillText(score_player, this.x, this.y)
			}
		}

		opponent_score = {
			x: null,
			y: null,
			size: "24px",
			font: "Arial",
			color: "#0088ff",

			draw: function(){
				ctx.fillStyle = this.color;
				ctx.font = this.size + " " + this.font;
				ctx.fillText(score_opponent, this.x, this.y)
			}
		}

		//Functions
		function main(){
			canvas.style.opacity = "1";

			keystate = {}
			document.addEventListener("keydown", function(evt){
				keystate[evt.keyCode] = true;
			})
			document.addEventListener("keyup", function(evt){
				delete keystate[evt.keyCode]
			})	

			init();
			function loop(){
				update();
				draw();
				window.requestAnimationFrame(loop, canvas)
			}
			window.requestAnimationFrame(loop, canvas)
		}

		function init(){
			//Draw Score
			player_score.x = (WIDTH/2)-50;
			opponent_score.x = (WIDTH/2)+50;

			player_score.y = 50;
			opponent_score.y = 50;

			//Draw Objects
			player.x = 10;
			player.y = (HEIGHT/2)-(player.height/2);

			opponent.x = WIDTH - opponent.width - 10;
			opponent.y = (HEIGHT/2)-(opponent.height/2);

			ball.x = (WIDTH/2)-(ball.side/2);
			ball.y = (HEIGHT/2)-(ball.side/2);

			ball.vel = {
				x: ball.speed,
				y: 0
			}
		}

		function update(){
			player.update();
			opponent.update();
			ball.update();
		}	

		function draw(){
			ctx.fillStyle = 'black';
			ctx.fillRect(0, 0, WIDTH, HEIGHT);

			for (var i = HEIGHT; i > 0; i -= 20){
				ctx.fillStyle = 'red';
				ctx.fillRect((WIDTH/2)-(2), (HEIGHT - i), 4, 8)
			}

			player_score.draw();
			opponent_score.draw();

			ctx.save();

			player.draw();
			opponent.draw();
			ball.draw();

			ctx.restore();
		}

		main();

	}

	function main0(){
		canvas = document.getElementById("canvas")
		ctx = canvas.getContext('2d')
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		canvas.style.width = "51.24450951683748%";
		canvas.style.height = HEIGHT;
		canvas.style.border = "none";
		canvas.style.opacity = "0.9";

		ctx.fillStyle = "#167FB1";
		ctx.fillRect(0, 0, WIDTH, HEIGHT);

		ctx.fillStyle = "#E0922B";
		ctx.fillRect(200, 187.5, 300, 150);

		ctx.fillStyle = "#000";
		ctx.font = "bold 40pt Verdana";
		ctx.textAlign = "center";
		ctx.fillText("Start", (WIDTH/2), (HEIGHT/1.9));

		ctx.fillStyle = "#272727";
	    ctx.lineWidth = 10;
	    ctx.strokeRect(200, 187.5, 300, 150);
	}

	main0();

	canvas.addEventListener('click', function(){
		start();
		firstTime++;
	});


}

var load = function(){

	var colors = ["#55bbaa", "#99aacc", "#00ccff", "#1fcc3e", "#24809e", "#3f9e51", "#49c6e5", "#2Ceaa3", "#7cfef0", "#a9ddd6"];
	var rc = colors[Math.round(Math.random()*(colors.length-1))];

	var WIDTH = 268;
	var HEIGHT = 698;
	var canvas;
	var ctx;

	var r = 18.3684211;
	var pi = Math.PI;

	var main = function(){
		canvas = document.getElementById('thing');
		ctx = canvas.getContext('2d');
		canvas.width = WIDTH;
		canvas.height = HEIGHT;

		draw();
	}

	var draw = function(){

		//Row 1 => 7
		for(var i = 0; i < 7; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), r, r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}

		//Row 2 => 6
		for(var i = 0; i < 6; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), (r*3), r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}

		//Row 3 => 5
		for(var i = 0; i < 5; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), (r*5), r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}

		//Row 4 => 4
		for(var i = 0; i < 4; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), (r*7), r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}

		//Row 5 => 5
		for(var i = 0; i < 5; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), (r*9), r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}

		//Row 6 => 6
		for(var i = 0; i < 6; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), (r*11), r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}

		//Row 7 => 2
		for(var i = 0; i < 2; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), (r*13), r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}

		//Row 8 => 5
		for(var i = 0; i < 5; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), (r*15), r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}

		//Row 9 => 6
		for(var i = 0; i < 6; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), (r*17), r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}


		//Row 10 => 6
		for(var i = 0; i < 6; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), (r*19), r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}

		//Row 11 => 4
		for(var i = 0; i < 4; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), (r*21), r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}

		//Row 12 => 7
		for(var i = 0; i < 7; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), (r*23), r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}

		//Row 13 => 6
		for(var i = 0; i < 6; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), (r*25), r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}

		//Row 14 => 5
		for(var i = 0; i < 5; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), (r*27), r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}

		//Row 15 => 6
		for(var i = 0; i < 6; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), (r*29), r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}

		//Row 16 => 4
		for(var i = 0; i < 4; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), (r*31), r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}

		//Row 17 => 5
		for(var i = 0; i < 5; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), (r*33), r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}

		//Row 18 => 5
		for(var i = 0; i < 5; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), (r*35), r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}

		//Row 19 => 2
		for(var i = 0; i < 2; i++){
			ctx.beginPath();
		    ctx.arc(WIDTH-r-(2*r*i), (r*37), r, 0, 2 * pi);
		    ctx.fillStyle = rc;
		    ctx.fill();
		    rc = colors[Math.round(Math.random()*(colors.length-1))];
		}
	}

	main();
	
    $("#menu").hide().delay().fadeIn(200);
    $("#logo_img").hide().delay(250).fadeIn(200);
    $("#mcnt").hide().delay(500).fadeIn(200);
    $("section").hide().delay(750).fadeIn(200);
}

$(document).ready(load);
