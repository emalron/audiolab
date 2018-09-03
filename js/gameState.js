var gameState = {preload: preload, create: create, update: update};
var gui = new dat.GUI();
var Option = function() {
    this.path_visible = false;
    this.show_volume = false;
    this.boy_velocity = 10;
    this.girl_timer = 15;
    this.volume_denom = 600;
    this.search_radius = 80;
};
var option = new Option();


gui.add(option, 'path_visible');
gui.add(option, 'show_volume');
gui.add(option, 'boy_velocity', 0, 10);
gui.add(option, 'girl_timer', 0, 20);
gui.add(option, 'volume_denom', 0, 848);



function preload() {
    let g = game;
    
    g.load.image('bg', 'assets/images/background.png');
    g.load.image('wall', 'assets/images/wall.png');
    g.load.image('boy', 'assets/images/cook.png');
    g.load.image('girl', 'assets/images/customer.png');
    g.load.audio('talking', 'assets/audio/talking.mp3');
    g.load.image('crate', 'assets/images/crate.png');
    
    g.map = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    
    g.nodes = [];
}

function create() {
    let g = game;
    
    // draw entities
    g.background = g.add.sprite(0,0,'bg');
    g.bwall1 = {position: {x:(278+6.5), y:187/2}, height: 187, width: 13, key: 'bwall1'};
    g.bwall2 = {position: {x:(278+6.5), y:187+77+50}, height: 100, width: 13, key: 'bwall2'};
    g.bwall3 = {position: {x:(392+600)/2, y:360+13/2}, height: 13, width: 600-392, key: 'bwall3'};
    g.wall = g.add.sprite(278+6.5,188+77/2,'wall');
    g.wall.inputEnabled = true;
    g.wall.events.onInputDown.add(wallChange);
    g.wall.states = 0;
    g.wall.anchor.setTo(.5);
    
    // make crates array
    var cratesLocation = [{x: 34, y:47}, {x: 232, y:183}, {x: 329, y:43}, {x:240, y:343}, {x: 549, y: 318}, {x: 63, y: 478}, {x: 317, y:561}, {x: 546, y: 437}]
    g.crates = [];
    
    cratesLocation.forEach((v,i) => {
        var crate = g.add.sprite(v.x, v.y, 'crate');
        crate.anchor.setTo(.5);
        g.crates.push(crate);
    });
    
    g.boy = g.add.sprite(100, 100, 'boy');
    g.boy.anchor.setTo(.5);
    g.boy.inputEnabled = true;
    // g.boy.input.enableDrag();
    
    g.girl = g.add.sprite(465,157, 'girl');    
    g.girl.anchor.setTo(.5);
    g.girl.sound = g.add.audio('talking');
    g.girl.sound.loopFull();
    g.girl.occupied = false;
    g.girl.hp = 3;
    g.girl.timer = option.girl_timer * 1000;
    g.girl.alpha = 0;
    
    g.girl.occupied = true;
    g.girl.rnd = Math.floor(Math.random() * g.crates.length);
    let dest = g.crates[g.girl.rnd];
    g.girl.position = dest;
    
    g.collidable = [];
    g.collidable.push(g.wall);
    g.collidable.push(g.bwall1);
    g.collidable.push(g.bwall2);
    g.collidable.push(g.bwall3);
    
    g.liner = g.add.graphics(0,0);
    
    var style = {font: '18px arial', fill:'#f00'}
    g.volUI = g.add.text(35, 548, 'Volume: ', style);
    g.crateUI = g.add.text(484, 10, 'Crates: ', style);
    g.ghostUI = g.add.text(488, 30, 'Ghost: ', style);
    
    // remapping the map data to node data
    g.nodes = g.map.map(function(v,i) {
        let y = i;
        let xarr = v.map(function(v2, i2) {
            let x = i2;
            return {position: {x: i2, y:i}, type:v2, f:0, g:0, h:0, visited: undefined, parent: undefined};
        })
        
        return xarr;
    })
    
    displaySound();
    
    prevt = g.time.now;
    curt = g.time.now;
}

function update() {
    getInput();
    popupGirl();
    changeVolume();
    uiUpdate();
}

var inputEnable = true;
var dt = 0;
var prevt = 0;
var curt = 0;

function getInput(key) {
    let g = game;
    let v = option.boy_velocity;
    let oldPosition = g.boy.position;
    
    if(inputEnable) {
        if(game.input.keyboard.isDown(Phaser.KeyCode.A)) {
            oldPosition = g.boy.position;
            var col = collideSearch({x:-v, y:0});
            console.log(col);
            if(col == true) {
               g.boy.position.x -= option.boy_velocity;
            }
            else {
                g.boy.position = oldPosition;
            }
            
            inputEnable = true;
        }
        else if (game.input.keyboard.isDown(Phaser.KeyCode.D)) {
            oldPosition = g.boy.position;
            if(collideSearch({x: v, y:0})) { 
                g.boy.position.x += option.boy_velocity;
            }
            else {
                g.boy.position = oldPosition;
            }
            inputEnable = true;
        }
        else if (game.input.keyboard.isDown(Phaser.KeyCode.S)) {
            oldPosition = g.boy.position;
            if(collideSearch({x:0, y:v})) {
                g.boy.position.y += option.boy_velocity;
            }
            else {
                g.boy.position = oldPosition;
            }
            inputEnable = true;
        }
        else if (game.input.keyboard.isDown(Phaser.KeyCode.W)) {
            oldPosition = g.boy.position;
            if(collideSearch({x:0, y:-v})) {
                g.boy.position.y -= option.boy_velocity;
            }
            else {
                g.boy.position = oldPosition;
            }
            inputEnable = true;
        }
        else if (game.input.keyboard.justPressed(Phaser.KeyCode.SPACEBAR)) {
            let dist = Math.sqrt(Math.pow(g.boy.x-g.girl.x, 2) + Math.pow(g.boy.y-g.girl.y,2));
            let showGirl = g.add.tween(g.girl);
            if(dist <= option.search_radius) {
                g.girl.hp -= 1;
                g.girl.alpha = 1;
                showGirl.to({alpha: 0}, 500);
                showGirl.start();
                showGirl.onComplete.add(function() {
                    g.girl.timer = option.girl_timer*1000;
                    g.occupied = false;
                    g.girl.rnd = Math.floor(Math.random() * g.crates.length);
                    let dest = g.crates[g.girl.rnd];
                    
                    g.girl.position = dest;
                }, this);
            }
        }
    }
}

function collideSearch(nPos) {
    let g = game;
    let radius = g.boy.width/2;
    let _pos = g.boy.position;
    let pos = {x: _pos.x+nPos.x, y:_pos.y+nPos.y};
    
    if(pos.x < radius || pos.x > g.world.width-radius || pos.y < radius || pos.y > g.world.height - radius) {
        console.log('hit the boundaries');
        return false;
    }
        
    for(var i=0; i < g.collidable.length; i++) {
        let v = g.collidable[i]
        
        let _tpos = v.position;
        let _thr = v.height/2;
        let _twr = v.width/2;
        
        let bl = pos.x - radius;
        let br = pos.x + radius;
        let bt = pos.y - radius;
        let bb = pos.y + radius;
        
        let tl = _tpos.x - _twr;
        let tr = _tpos.x + _twr;
        let tt = _tpos.y - _thr;
        let tb = _tpos.y + _thr;
        
        // horizontally collision
        // case 1: boy(left), object(right) br < tr
        // case 2: boy(right), object(left) else
        
        // vertically collision
        // case 1: boy(bottom), object(top) bt > tt
        // case 2: boy(top), object(bottom) else
        
        if (tl < br && bl < tr && bt < tb && tt < bb) {
            inputEnable = false;
            
            console.log(v.key);
            return false;
        }
    }
    return true;
}

function popupGirl() {
    let g = game;
    
    prev = curt;
    curt = g.time.now;
    dt = curt - prev;
    
    g.girl.timer -= dt;
    
    if(g.girl.timer < 0) {
        g.girl.timer = option.girl_timer * 1000;
        if(g.girl.occupied) {
            g.crates[g.girl.rnd].destroy();
            g.crates.splice(g.girl.rnd, 1);
        }

        if(g.crates.length >= 1) {
            g.girl.occupied = true;

            g.girl.rnd = Math.floor(Math.random() * g.crates.length);
            let dest = g.crates[g.girl.rnd];

            g.girl.position = dest;
        }
        else {
            g.girl.occupied = false;
            console.log('you lost');
        }
    }
}

function displaySound(path) {
    let g = game;
    let line = [];
    let _path = path;
    
    for(var i=0; i<_path.x.length; i++) {
        let point = {x: _path.x[i], y: _path.y[i]}
        line.push(point);
    }
    
    g.liner.clear();
    g.liner.lineStyle(2, 0x008800, 1);
    line.reverse();
    g.liner.moveTo(line[0].x, line[0].y);
    for(var j=1;j<line.length;j++) {
        g.liner.lineTo(line[j].x, line[j].y);
    }
}

function wallChange() {
    let g = game;
    let map =[
        [1],
        [0]
    ];
    
    g.wall.states = map[g.wall.states][0];
    
    switch(g.wall.states) {
        case 0:
            g.nodes[7][9].type = 1;
            g.nodes[7][10].type = 1;
            g.nodes[8][9].type = 1;
            g.nodes[8][10].type = 1;
            g.nodes[9][9].type = 1;
            g.nodes[9][10].type = 1;
            g.wall.alpha = 1.0;
            break;
        case 1:
            g.nodes[7][9].type = 0;
            g.nodes[7][10].type = 0;
            g.nodes[8][9].type = 0;
            g.nodes[8][10].type = 0;
            g.nodes[9][9].type = 0;
            g.nodes[9][10].type = 0;
            g.wall.alpha = .5;            
            break;
    }
}

function changeVolume() {
    let g = game;
    // let bp = g.boy.position;
    // let gp = g.girl.position;
    // let dist = Math.sqrt(Math.pow((bp.x - gp.x),2) + Math.pow((bp.y - gp.y),2));
    
    let gp = getCoordinate(g.girl.position);
    let bp = getCoordinate(g.boy.position);
    
    let clist = astar(gp, bp);
    let path = drawLine(clist);
    let dist = path.x.length*30;
    
    let vol = Math.max(0,1 - dist/option.volume_denom);
    
    g.girl.sound.volume = vol;
    
    if(option.path_visible) {
        displaySound(path)
    }
    else {
        g.liner.clear();
    }
}

function uiUpdate() {
    let g = game;
    let percent = Math.floor(g.girl.sound.volume * 100);
    
    if(option.show_volume) g.volUI.text = 'Volume: ' + percent + '%';
    g.crateUI.text = 'Crates: ' + g.crates.length + '/8';
    g.ghostUI.text = 'Ghost: ' + g.girl.hp + '/3';
}

function getCoordinate(position) {
    let p = position;
    let r = {x: Math.round(p.x/30), y: Math.round(p.y/30)};
    
    return r;
}

function seeThere(coordinates) {
    let co = coordinates;
    let g = game;
    
    return g.map[co.y][co.x];
}

function moveBoy(o, pointer) {
    let g = game;
    let p = getCoordinate(pointer.position);
    
    if(g.nodes[p.y][p.x].type != 1) {
        findPath(pointer);
    }
}

function findPath(dest) {
    let g = game;
    let de = getCoordinate(dest);
    let st = getCoordinate(g.boy.position);
    let closelist = astar(st, de);
    
    let path = drawLine(closelist);
    moveAlongPath(path);
}

function drawLine(path) {
    let g = game;
    let first = path[0];
    let last = path[path.length-1];
    var linesX = [];
    var linesY = [];
    
    while(last != first) {
        linesX.push(last.position.x * 30);
        linesY.push(last.position.y * 30);
        
        last = last.parent;
    }
        
    return {x:linesX, y:linesY};
}

function moveAlongPath(path) {
    let g = game;
    var mov = g.add.tween(g.boy);    
    mov.to({x: path.x, y: path.y}, 500);
    mov.start();
}

function astar(coFrom, coTo) {
    let g = game;
    let firstNode = g.nodes[coFrom.y][coFrom.x];
    let destNode = g.nodes[coTo.y][coTo.x];
    let openList = [];
    let closeList= [];
    let dx = [1, 1, 0, -1, -1, -1, 0, 1];
    let dy = [0, 1, 1, 1, 0, -1, -1, -1];
    let ms = [10, 14, 10, 14, 10, 14, 10, 14];
    let working = true;
    
    openList.push(firstNode);
    
    while(openList.length > 0) {
        let current = openList.reduce(function(prev, cur) {
            return prev.f > cur.f ? cur : prev;
        });

        // remove the node from the openlist and add it the closelist.
        let gid = openList.indexOf(current);
        openList.splice(gid,1);
        closeList.push(current);
                
        // find adjacent nodes of the selected node
        for(var n=0;n<8;n++) {
            let nx = current.position.x + dx[n];
            let ny = current.position.y + dy[n];
            let _node = g.nodes[ny][nx];
            
            if(_node.type != 1 && closeList.indexOf(_node) == -1) {
                if(openList.indexOf(_node) == -1) {
                    _node.g = ms[n] + current.g;
                    _node.h = (Math.abs(destNode.position.x - _node.position.x) + Math.abs(destNode.position.y - _node.position.y))*10;
                    _node.f = _node.g + _node.h;
                    _node.parent = current;
                    openList.push(_node);
                }
                else {
                    let prevG = current.g;
                    let currentG = ms[n];
                    
                    if (currentG + prevG < _node.g) {
                        _node.g = currentG + prevG;
                        _node.f = _node.g + _node.h;
                        _node.parent = current;
                    }
                }
            }
        }
        
        // is the destination node in openList?
        var res = openList.indexOf(destNode);
        
        if(res != -1) {
            closeList.push(openList[res]);
            working = false;
            break;
        }

    }

    return closeList;
}