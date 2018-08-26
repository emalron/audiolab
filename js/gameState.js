var gameState = {preload: preload, create: create, update: update};

function preload() {
    let g = game;
    
    g.load.image('bg', 'assets/images/background.png');
    g.load.image('wall', 'assets/images/wall.png');
    g.load.image('boy', 'assets/images/cook.png');
    g.load.image('girl', 'assets/images/customer.png');
    g.load.audio('talking', 'assets/audio/talking.mp3');
    
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
    g.background.inputEnabled = true;
    g.background.events.onInputDown.add(moveBoy);
    g.wall = g.add.sprite(278,188,'wall');
    g.boy = g.add.sprite(100, 100, 'boy');
    g.boy.anchor.setTo(.5);
    g.girl = g.add.sprite(465,157, 'girl');
    var g2 = g.add.sprite(415, 137, 'girl');
    g2.anchor.setTo(.5);
    g2.scale.setTo(-1, 1);
    var g3 = g.add.sprite(425, 197, 'girl');
    g3.anchor.setTo(.5);
    g3.scale.setTo(-1, 1);
    
    g.girl.anchor.setTo(.5);
    g.girl.sound = g.add.audio('talking');
    g.girl.sound.loopFull();
    let girlLoc = getCoordinate(g.girl);
    g.map[girlLoc.y][girlLoc.x] = 2;
    
    
    g.boy.inputEnabled = true;
    g.boy.input.enableDrag();
    
    var style = {font: '18px arial', fill:'#f00'}
    g.volUI = g.add.text(35, 548, 'Volume: ', style);
    
    var line = new Phaser.Line(100, 100, 500, 500);
    
    g.nodes = g.map.map(function(v,i) {
        let y = i;
        let xarr = v.map(function(v2, i2) {
            let x = i2;
            return {position: {x: i2, y:i}, type:v2, f:0, g:0, h:0, visited: undefined, parent: undefined};
        })
        
        return xarr;
    })
}

function update() {
    changeVolume();
    uiUpdate();
}

function changeVolume() {
    let g = game;
    let bp = g.boy.position;
    let gp = g.girl.position;
    
    let dist = Math.sqrt(Math.pow((bp.x - gp.x),2) + Math.pow((bp.y - gp.y),2));
    let vol = 1 - dist/600;
    
    g.girl.sound.volume = vol;
}

function uiUpdate() {
    let g = game;
    let percent = Math.floor(g.girl.sound.volume * 100);
    
    g.volUI.text = 'Volume: ' + percent + '%';
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
    
    console.log(p);
    
    if(g.nodes[p.y][p.x].type != 1) {
        let path = findPath(pointer);
    }
}

function findPath(dest) {
    let g = game;
    let de = getCoordinate(dest);
    let st = getCoordinate(g.boy.position);
    
    g.map[de.y][de.x] = 3;
    
    var path = astar(st, de);
    
    drawLine(path);
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
    
    console.log(linesX.reverse());
    console.log(linesY.reverse())
    
    var mov = g.add.tween(g.boy);    
    mov.to({x: linesX, y: linesY}, 500);
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
    
    //while(working) {
    for(var num = 0; num < 100; num++) {
        // get the node having minimun of f-value from openlist.
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
                    _node.g = ms[n];
                    _node.h = (Math.abs(destNode.position.x - _node.position.x) + Math.abs(destNode.position.y - _node.position.y))*10;
                    _node.f = _node.g + _node.h;
                    _node.parent = current;
                    openList.push(_node);
                }
                else {
                    let currentG = current.g;
                    let prevG = ms[n];
                    
                    if (currentG + prevG < _node.g) {
                        _node.g = currentG + prevG;
                        _node.f = _node.g + _node.h;
                        _node.parent = current;
                    }
                }
            }
        }
                
        console.log('closed list' + ' [' + num + ']')
        console.log(closeList);
                
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