var stage = 1;

var input = "110";
var output = "110";

var click_elements = [];
var lineCollection = [];
var pressedFlag = false;

var mouseX = 0;
var mouseY = 0;

var dragObjectIndex;
var clickIndex;

var result = "";
var interval;

function init(){
	var elem = document.getElementById('canvas'),
		elemLeft = elem.offsetLeft,
		elemTop = elem.offsetTop,
		context = elem.getContext('2d');
	var count = 0;
	var tmp = [];

	context.clearRect(0, 0, canvas.width, canvas.height);
	canvas.setAttribute('style', 'background:black;');
	$('#canvas').off('click');
	elem.addEventListener('click', function(event) {
		var x = event.pageX - elemLeft,
		y = event.pageY - elemTop;
	
		click_elements.forEach(function(element, index, arr) {
			if(y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
				if(element.title == 'clock'){
					callClock();
if(output == result){
					window.location.href = '../aa.html';
}
					$('#2222').text("");
					$('#2222').append(result);
					/*if(result == output){
						clearInterval(interval);
						context.clearRect(0, 0, elem.width, elem.height);
						var x = Math.random() * 500;
						var y = Math.random() * 500;
						var image = new Image();
						image.src = './img/pro.jpg';
						context.beginPath();
						context.arc(x, y, 5, 0, Math.PI*2, true);
						context.fill();
						context.drawImage(image, x, y, 200, 100);
					}*/
				}
				if(element.title == 'reset')
					callReset();
				if(element.title == 'gate' || element.title == 'input' || element.title == 'output'){
					console.log(element.title);
					clickIndex = index;
					arr[index].click = 'true';
					tmp.push(index);
				}
			}
			if(element.click !== undefined && element.click == "true"){
				count++;
			}
		});
		if(count == 2){
			click_elements[tmp[0]].dst.push(tmp[1]);
			context.beginPath();
			context.moveTo(click_elements[tmp[0]].left + click_elements[tmp[0]].width/2, click_elements[tmp[0]].top + click_elements[tmp[0]].height/2);
			context.lineTo(click_elements[tmp[1]].left + click_elements[tmp[1]].width/2, click_elements[tmp[1]].top + click_elements[tmp[1]].height/2);
			context.lineWidth = 10;
			context.strokeStyle = '#ff0000';
			context.stroke();

			lineCollection.push({ startX:click_elements[tmp[0]].left + click_elements[tmp[0]].width/2, startY:click_elements[tmp[0]].top + click_elements[tmp[0]].height/2, 
						dstX:click_elements[tmp[1]].left + click_elements[tmp[1]].width/2, dstY: click_elements[tmp[1]].top + click_elements[tmp[1]].height/2 });
			
			tmp = [];
			click_elements.forEach(function(element){
				if(element.click == "true")
					element.click = "false";
			});
		}
		count = 0;
	}, false);

	$('#canvas').mousedown(function(event){
		var x = event.pageX - elemLeft,
		y = event.pageY - elemTop;

		pressedFlag = true;
		click_elements.forEach(function(element, index, arr){
			if(y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
				if(element.title == 'gate')
					dragObjectIndex = index;
			}
		});
	});
	$('#canvas').mouseup(function(){
		pressedFlag = false;
		dragObjectIndex = undefined;
	});
	$('#canvas').mousemove(function(e){
		mouseX = e.offsetX;
		mouseY = e.offsetY;

		if(pressedFlag){
			context.clearRect(click_elements[dragObjectIndex].left, click_elements[dragObjectIndex].top, click_elements[dragObjectIndex].width, click_elements[dragObjectIndex].height);
			
			click_elements[dragObjectIndex].top = mouseY;
			click_elements[dragObjectIndex].left = mouseX;
		}
	});

	click_elements.push(
	{ color:'#000000', width:233, height:204, top:50, left:950, title:'output', image:'./img/output.jpg', dst:[] },
	{ color:'#000000', width:212, height:171, top:350, left:0, title:'input', image:'./img/input.png', dst:[] },
	//CLOCK
	{ color:'#05EFFF', width:245, height:245, top:470, left:950, title:'clock', image:'./img/clock.jpg'}, 
//	{ color:'#05EFFF', width:500, height:500, top:30, left:1050, title:'clock', image:'./img/CLOCK.jpg'}, 
	//RESET
	{ color:'#000000', width:175, height:90, top:600, left:750, title:'reset', image:'./img/reset.jpg'}
	);
}

function drawFrame(){
	var context = document.getElementById('canvas').getContext('2d');
//	document.getElementById('canvas').setAttribute('style', 'background:url("./img/main.jpg");');
	click_elements.forEach(function(element) {
		var img = new Image();
		img.src = element.image;
		if(element.click !== undefined && element.click == "true" && element.title == 'gate'){
			img.src = 'img/border_' + element.type + '.jpg';
		}else{
			img.src = element.image;
		}
		context.drawImage(img, element.left, element.top);
//		context.fillStyle = element.color;
//		context.fillRect(element.left, element.top, element.width, element.height);
	});

	for(var i =0; i<lineCollection.length; i++){
		context.beginPath();
		context.moveTo(lineCollection[i].startX, lineCollection[i].startY);
		context.lineTo(lineCollection[i].endX, lineCollection[i].endY);
		context.lineWidth = 10;
		context.strokeStyle = '#ff0000';
		context.stroke();
	}
/*	lineCollection.forEach(function(element) {
                context.beginPath();
		context.moveTo(element.startX, element.startY);
		context.lineTo(element.endX, element.endY);
                context.lineWidth = 10;
                context.strokeStyle = '#ff0000';
		context.stroke();	
	});*/
}

function callReset(){
	var canvas = document.getElementById('canvas');
	var context = document.getElementById('canvas').getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	click_elements.forEach(function(element, index, arr){
		if(element.title == 'gate')
			delete arr[index];
	});
}

function callClock(){
	var flag = [];
	var output2 = 3;	

	for(var i =0; i<click_elements.length; i++)
		flag.push(false);
	flag[1] = true;

	var ggokji = 0;
	for(var i =0; i<output2;){
		if(ggokji < input.length)
			click_elements[1].output = Number(input[ggokji++]);
else
click_elements[1].output = 0;
		for(var j = 0; j<click_elements.length; j++){
			if(j==1){
						
				continue;
			}
			if(flag[j]){
				if(j == 0)
					click_elements[j].output = click_elements[j].input;
				else if(click_elements[j].type == 'OR'){
					click_elements[j].output = 0;
					for(var k =0; k<click_elements[j].input.length; k++){
						if(click_elements[j].input[k] == 1){
							click_elements[j].output = 1;
							break;
						}
					}
					click_elements[j].input = [];
				}
				else if(click_elements[j].type == 'AND'){
					click_elements[j].output = 1;
					for(var k =0; k<click_elements[j].input.length; k++){
						if(click_elements[j].input[k] == 0){
							click_elements[j].output = 0;
							break;
						}
					}
					click_elements[j].input = [];
				}
				else if(click_elements[j].type == 'NOR'){
					click_elements[j].output = 1;
					for(var k =0; k<click_elements[j].input.length; k++){
						if(click_elements[j].input[k] == 1){
							click_elements[j].output = 0;
							break;
						}
					}
					click_elements[j].input = [];
				}
				else if(click_elements[j].type == 'NAND'){
					click_elements[j].output = 0;
					for(var k =0; k<click_elements[j].input.length; k++){
						if(click_elements[j].input[k] == 0){
							click_elements[j].output = 1;
							break;
						}
					}
					click_elements[j].input = [];
				}
				else if(click_elements[j].type == 'NOT'){
if(click_elements[j].input == 1) click_elements[j].output = 0;
else click_elements[j].output = 1;
				//	click_elements[j].output = ~(click_elements[j].input);
				}
				else{
					if(click_elements[j].input != undefined){
						if(click_elements[j].input[0] != click_elements[j].input[1])
							click_elements[j].output = 1;
						else
							click_elements[j].output = 0;
					}
					click_elements[j].input[0] = undefined;
					click_elements[j].input[1] = undefined;
				}
			}
		}
	var change = [];
	for(var j =0; j<click_elements.length; j++){
		if(flag[j]){
			if( j == 0){
				result += String(click_elements[j].output);	
				i++;
				continue;
			}
			for(var k =0; k<click_elements[j].dst.length; k++){
				var temp = click_elements[j].dst[k];
				if(temp == 0)
					click_elements[temp].input = click_elements[j].output;
				else if(click_elements[temp].type == 'NOT')
					click_elements[temp].input = click_elements[j].output;
				else if(click_elements[temp].type == 'XOR'){
					if(click_elements[temp].input[0] == undefined)
						click_elements[temp].input[0] = click_elements[j].output;
					else
						click_elements[temp].input[1] = click_elements[j].output;
				}
				else
					click_elements[temp].input.push(click_elements[j].output);
				change.push(temp);
			}
		}
	}
	
	for(var j =0; j<change.length; j++)
		flag[change[j]] = true;
	}
}

function canvasImg(canvas){
	var ctx = canvas.getContext('2d');
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	var img = canvas.toDataURL('image/png');
	
	return img;
}

function placeImage(canvas, img){
	var ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0);
}

function createRect(canvas, width, height){
	var ctx = canvas.getContext('2d');
	ctx.rect(20, 20, 150, 100);
	ctx.stroke();
}

function menu(){
	var canvas = document.getElementById('canvas');
	document.getElementById('canvas').setAttribute('style', 'background:white;');
	var ctx = canvas.getContext('2d');
	var element = { color:'#000000', width:170, height:80, top:630, left:950 };
	
	ctx.fillStyle = element.color;
	ctx.fillRect(element.left, element.top, element.width, element.height);
	
	var img = new Image();
	img.src = './img/main.jpg';
	img.onload = function(){
		var pattern = ctx.createPattern(img, 'no-repeat');
		ctx.fillStyle = pattern;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	};

	$('#canvas').click(function(event){
		var x = event.pageX - canvas.offsetLeft;
		var y = event.pageY - canvas.offsetTop;
		if(y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width){
			$('#wrapper').css('display', 'block');
			init();
		}
	});
}

function loadImage(src){
	var obj = new Image();
	obj.src = src;
	
	return obj;
}

window.onload = function(){
	var width = 1200;
	var height = 730;

	var canvas_element = document.getElementById('canvas');
	canvas_element.setAttribute('width', width);
	canvas_element.setAttribute('height', height);
	var ctx = canvas_element.getContext('2d');

	menu();
	interval = setInterval(drawFrame, 1);
//	init();
	
	//var canvas = createCanvas(800, 600);
	//var hiddenCanvas = createCanvas(800, 600);
	//var i = canvasImg(hiddenCanvas);

	//var img = new Image();
	//img.src = i;
	//placeImage(canvas, img);
	//createRect(canvas, 0, 0);
	//document.body.appendChild(canvas);
}


