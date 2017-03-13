'use strict';

var UPDATE_FUNC;

// text, x, y, width, height
var button = function(obj) {
    this.text = obj.text;
    this.position = {x: obj.x, y: obj.y};
    this.size = {width: obj.width, height: obj.height};
    this.ui_object_idx = game_manager.ui_object.push(this) - 1;
    this.click_object_idx = click_manager.click_component.push({
        object: {width: obj.width, height: obj.height},
        x: obj.x,
        y: obj.y,
        click: obj.click
    }) - 1;
    
    this.draw = function() {
        game_manager.canvasCtx.font = "30px Arial";
        game_manager.canvasCtx.fillText(this.text, this.position.x, this.position.y + this.size.height);
        game_manager.canvasCtx.beginPath();
        game_manager.canvasCtx.rect(this.position.x, this.position.y, this.size.width, this.size.height);
        game_manager.canvasCtx.stroke();
    }
    
    this.button_position_update = function(val) {
        this.position = {x: val.x, y: val.y};
        
        game_manager.ui_object[this.ui_object_idx].position.x = val.x;
        game_manager.ui_object[this.ui_object_idx].position.y = val.y;

        click_manager.click_component[this.click_object_idx].x = val.x;
        click_manager.click_component[this.click_object_idx].y = val.y;
    }
}

var gate = function(_gate_name, _gate_type, _position, _gate_index){
    this.gate_index = _gate_index;
    this.position = _position;
    this.connected_input = [];
    this.connected_output = [];
    this.gate_name = _gate_name;
    this.gate_type = _gate_type;
    this.image = game_manager.gate_loader[_gate_name];
    this.buttons = [
        new button({
            text: 'input',
            x: this.position.x + (this.image.width / 2),
            y: this.position.y - 30,
            width: 100,
            height: 30,
            click: function() {
                if (game_manager.current_selected_gate) {
                }
            }
        }),
        new button({
            text: 'output',
            x: this.position.x + (this.image.width / 2),
            y: this.position.y + this.image.height + 30,
            width: 100,
            height: 30,
            click: function() {
            }
        })
    ]

    this.calculate = function() {
    }
    
    // callback method 
    this.drag = function(comp, delta) {
        var _drag_obj = game_manager.gate_list[comp.gate_index];
        _drag_obj.position.x += delta.x;
        _drag_obj.position.y += delta.y;
        
        _drag_obj.buttons.forEach(function(elem) {
            elem.button_position_update({
                x: elem.position.x + delta.x,
                y: elem.position.y + delta.y
            });
        });
    }
    
    this.click = function(comp) {
        game_manager.current_selected_gate = this;
    }
};

var game_manager = new function() {
    this.canvas;
    this.canvasCtx;
    
    this.gate_list = {};
    this.gate_index = 0;
    this.current_selected_gate;

    this.gate_loader;
    this.resource_loader;
    this.ui_object = [];
    
    this.initial_scene_flag = true;
    
    this.canvas_init = function() {
        var width = 1200;
        var height = 730;

        this.canvas = document.getElementById('canvas');
        this.canvas.setAttribute('width', width);
        this.canvas.setAttribute('height', height);
        this.canvasCtx = document.getElementById('canvas').getContext('2d');
    }
    
    this.add_gate = function(_gate_name, _gate_type) {
        var _gate = new gate(_gate_name, _gate_type, {x: 0, y: 0}, this.gate_index);
        this.gate_list[this.gate_index] = _gate;
        
        click_manager.click_component.push({
            object: _gate.image,
            x: _gate.position.x,
            y: _gate.position.y,
            drag: _gate.drag,
            click: _gate.click,
            component: _gate
        });
        
        this.gate_index++;
    }
};

var click_manager = new function() {
    // {object: resource, x: number, y: number, component: obj, click: function, drag: function}
    this.click_component = [];
    
    this.mouse_down_pos = {x:0, y:0};
    this.mouse_down_flag = false;
    this.mouse_move_pos = {x:0, y:0};
    this.mouse_move_flag = false;
    this.mouse_move_delta = {x:0, y:0};
    
    this.mouse_clicked_component;
    
    this.click_action_component = function() {
        this.click_component.forEach(function(elem) {
            if (this.check_bounding_box(elem, this.mouse_down_pos)) {
                elem.click.call(this, elem);
            }
        }, this);
    }
    
    this.drag_action_component = function() {
        this.mouse_clicked_component.drag.call(null, this.mouse_clicked_component.component, this.mouse_move_delta);
    }
    
    this.check_bounding_box = function(obj, pos) {
        if (pos.x > obj.x && pos.y > obj.y && pos.y < obj.object.height + obj.y && pos.x < obj.object.width + obj.x) {
            return true;
        }
        
        return false;
    }
    
    this.init = function() {
        $('#canvas').mousedown($.proxy(function(e) {
            this.mouse_down_pos = {
                x: e.pageX - ($('#canvas').offset().left - window.pageXOffset),
                y: e.pageY - ($('#canvas').offset().top - window.pageYOffset),
            };
            this.mouse_down_flag = true;

            this.click_component.forEach(function(elem) {
                if (this.check_bounding_box(elem, this.mouse_down_pos)) {
                    this.mouse_clicked_component = elem;
                }
            }, this);
        }, this));

        $('#canvas').mousemove($.proxy(function(event) {
            this.mouse_move_delta = {
                x: (event.pageX - ($('#canvas').offset().left - window.pageXOffset)) - this.mouse_move_pos.x,
                y: (event.pageY - ($('#canvas').offset().top - window.pageYOffset)) - this.mouse_move_pos.y
            };
            
            this.mouse_move_pos = {
                x: event.pageX - ($('#canvas').offset().left - window.pageXOffset),
                y: event.pageY - ($('#canvas').offset().top - window.pageYOffset),
            };
            this.mouse_move_flag = true;
            
            if (this.mouse_down_flag)
                this.drag_action_component();
        }, this));

        $('#canvas').mouseup($.proxy(function(event) {
            if (this.mouse_down_pos.x == this.mouse_move_pos.x && 
                this.mouse_down_pos.y == this.mouse_move_pos.y) {
                this.click_action_component();
            }
            
            this.mouse_down_flag = false;
            this.mouse_move_flag = false;
        }, this));
    }
};

function init() {
    $('.gate_button').click(function(e) {
        if (!game_manager.initial_scene_flag)
            game_manager.add_gate($(e.currentTarget).attr('id'),
                                  $(e.currentTarget).attr('type'));
    });
    
    function loadImage(src){
        var obj = new Image();
        obj.src = src;

        return obj;
    }
    
    game_manager.gate_loader = {
        not: loadImage('./img/NOT.jpg'),
        and: loadImage('./img/AND.jpg'),
        or: loadImage('./img/OR.png'),
        xor: loadImage('./img/XOR.png'),
        nand: loadImage('./img/NAND.png'),
        nor: loadImage('./img/NOR.png'),
        zero: loadImage('./img/red.png'),
        one: loadImage('./img/blue.png')
    };
    
    game_manager.resource_loader = {
        input: loadImage('./img/input.png'),
        output: loadImage('./img/output.jpg'),
        clock: loadImage('./img/clock.jpg'),
        reset: loadImage('./img/reset.jpg'),
        main: loadImage('./img/main.jpg'),
        start: loadImage('./img/start.jpg')
    };
    
    game_manager.canvas_init();
    click_manager.init();
    initial_scene_start();

    animate();
}

function initial_scene_start() {
    game_manager.resource_loader.main.onload = function(){
        game_manager.canvasCtx.drawImage(game_manager.resource_loader.main, 0, 0, game_manager.canvas.width, game_manager.canvas.height);
        game_manager.canvas.setAttribute('style', 'background:white;');
        game_manager.canvasCtx.drawImage(game_manager.resource_loader.start, 950, 630);
    };
    
    game_manager.resource_loader.start.onload = function() {
        game_manager.canvasCtx.drawImage(game_manager.resource_loader.start, 950, 630);
        click_manager.click_component.push({
            object: game_manager.resource_loader.start,
            x: 950,
            y: 630,
            click: function() {
                clear();
                game_manager.initial_scene_flag = false;
                play_scene_start();
            }
        });        
    };
}

function play_scene_start() {
    click_manager.click_component = [];
    game_manager.ui_object.push({
        resource: game_manager.resource_loader.output,
        x: 950,
        y: 50
    }, {
        resource: game_manager.resource_loader.input,
        x: 0,
        y: 350,
    }, {
        resource: game_manager.resource_loader.clock,
        x: 950,
        y: 470,
    }, {
        resource: game_manager.resource_loader.reset,
        x: 750,
        y: 600,
    });
    
    click_manager.click_component.push({
        object: game_manager.resource_loader.output,
        x: 950,
        y: 50,
        click: function() {
            console.log('output');
        }
    }, {
        object: game_manager.resource_loader.input,
        x: 0,
        y: 350,
        click: function() {
            console.log('input');
        }        
    }, {
        object: game_manager.resource_loader.clock,
        x: 1050,
        y: 30,
        click: function() {
            console.log('clock');
        }        
    }, {
        object: game_manager.resource_loader.reset,
        x: 750,
        y: 600,
        click: function() {
            console.log('reset');
        }
    });
    
    UPDATE_FUNC = play_scene_update;
}

function play_scene_update() {
    // play scene
    if (!game_manager.initial_scene_flag) {
        clear();
        
        game_manager.ui_object.forEach(function(elem) {
            if (elem.draw !== undefined)
                elem.draw();
            else
                game_manager.canvasCtx.drawImage(elem.resource, elem.x, elem.y);
        });
        
        Object.keys(game_manager.gate_list).forEach(function(elem) {
            game_manager.canvasCtx.drawImage(game_manager.gate_list[elem].image, 
                                             game_manager.gate_list[elem].position.x, 
                                             game_manager.gate_list[elem].position.y);
            
            game_manager.gate_list[elem].buttons.forEach(function(btn) {
                btn.draw();
            });
        });
    }
}

function clear() {
    game_manager.canvasCtx.clearRect(0, 0, game_manager.canvas.width, game_manager.canvas.height);
}

function animate() {
    requestAnimFrame(animate);
    if (UPDATE_FUNC)
        UPDATE_FUNC.call();
}

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(callback, element){
            window.setTimeout(callback, 1000 / 60);
        };
})();

document.addEventListener("DOMContentLoaded", init);
