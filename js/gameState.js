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
    
    g.newMap = [];
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
    
    g.newMap = g.map.map(function(v,i) {
        let y = i;
        let xarr = v.map(function(v2, i2) {
            let x = i2;
            return {x: i2, y:i, value:v2, open: undefined};
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
    
    // if(seeThere(p) != 1) {
    //     let newP = {x: p.x*30, y: p.y*30};
    //     let moveTo = g.add.tween(g.boy);
    //     moveTo.to({x: newP.x, y:newP.y}, 3000);
    //     moveTo.start();
    // }
    
    let path = findPath(pointer);
}

function findPath(dest) {
    let g = game;
    let de = getCoordinate(dest);
    let st = getCoordinate(g.boy.position);
    
    g.map[de.y][de.x] = 3;
    
    var path = astar(st, de);
    
    drawLine(path);
    console.log('findPath: ');
    console.log(path);
}

function drawLine(path) {
    let g = game;
    let first = path[0];
    let last = path[path.length-1];
    var linesX = [];
    var linesY = [];

    while(last != first) {
        let temp = last.parent;
        
        linesX.push(last.position.x*30);
        linesY.push(last.position.y*30);
        last = temp;
    }
    
    var mov = g.add.tween(g.boy);
    
    console.log(linesX.reverse());
    console.log(linesY.reverse());
    
    mov.to({x: linesX, y: linesY}, 500);
    mov.start();
}

function Node(position) {
    this.position = position;
    this.id = position.x + game.map[0].length * position.y;
    this.parent = this;
    this.g = 10;
    this.h = 0;
    this.f = 0;
}
Node.prototype.addParent = function(Node) {
    this.parent = Node;
}
Node.prototype.calculate = function(Node, Move) {
    let dest = Node.position;
    let now = this.position;
    
    this.g = Move;
    this.h = (Math.abs(dest.x - now.x) + Math.abs(dest.y-now.y))*10;
    this.f = this.g + this.h;
}

function astar(coFrom, coTo) {
    let g = game;
    let firstNode = g.newMap[coFrom.y][coFrom.x];
    let destNode = g.newMap[coTo.y][coTo.x];
    let openList = [];
    let closeList= [];
    let dx = [1, 1, 0, -1, -1, -1, 0, 1];
    let dy = [0, 1, 1, 1, 0, -1, -1, -1];
    let ms = [10, 14, 10, 14, 10, 14, 10, 14];
    let working = true;
    
    openList.push(firstNode);
    g.map2[coFrom.x, coFrom.y];
    
    //while(working) {
    for(var num = 0; num < 2000; num++) {
        // get a node
        let v = openList.reduce(function(prev, cur) {
            return prev.f > cur.f ? cur : prev;
        });
        let gid = openList.indexOf(v);
        openList.splice(gid,1);
        closeList.push(v);
        
        // find adjacent nodes
        for(var n=0;n<8;n++) {
            let nx = v.position.x + dx[n];
            let ny = v.position.y + dy[n];
            
            if(g.map2[ny][nx] == 0) {               
                var node = new Node({x: nx, y: ny});
                node.calculate(destNode, ms[n]);
                node.addParent(v);
            }
            else {
                var ns = openlist.filter(function(e) {
                    if(e.position.x == nx && e.position.y == ny) {
                        return e;
                    }
                });
                
                var node = ns[0];
            }
            if(g.map[ny][nx] != 1 && closeList.indexOf(node) == -1) {
                node.calculate(destNode, ms[n]);
                openList.push(node);
            }
            else {
                if(closeList.indexOf(node) == -1) closeList.push(node);
            }
        }
        
        // is the destination node in openList?
        var res = openList.filter(function(e) {
            if(e.id == destNode.id) {
                return e;
            }
        });
        
        if(res.length > 0) {
            closeList.push(res[0]);
            console.log('find? destNode is..');
            console.log(destNode)
            working = false;
            break;
        }
    }
    
    return closeList;
}