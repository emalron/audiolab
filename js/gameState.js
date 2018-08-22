var gameState = {preload: preload, create: create, update: update};

function preload() {
    let g = game;
    
    g.load.image('bg', 'assets/images/background.png');
    g.load.image('boy', 'assets/images/cook.png');
    g.load.image('girl', 'assets/images/customer.png');
    g.load.audio('talking', 'assets/audio/talking.mp3');
}

function create() {
    let g = game;
    
    // draw entities
    g.background = g.add.sprite(0,0,'bg');
    g.boy = g.add.sprite(100, 100, 'boy');
    g.boy.anchor.setTo(.5);
    g.girl = g.add.sprite(600,100, 'girl');
    var g2 = g.add.sprite(550, 80, 'girl');
    g2.anchor.setTo(.5);
    g2.scale.setTo(-1, 1);
    var g3 = g.add.sprite(560, 140, 'girl');
    g3.anchor.setTo(.5);
    g3.scale.setTo(-1, 1);
    
    g.girl.anchor.setTo(.5);
    g.girl.sound = g.add.audio('talking');
    g.girl.sound.loopFull();
    
    
    g.boy.inputEnabled = true;
    g.boy.input.enableDrag();
    
    var style = {font: '18px arial', fill:'#000'}
    g.volUI = g.add.text(20, 310, 'Volume: ', style);
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
    
    console.log(vol);
    
    g.girl.sound.volume = vol;
}

function uiUpdate() {
    let g = game;
    let percent = Math.floor(g.girl.sound.volume * 100);
    
    g.volUI.text = 'Volume: ' + percent + '%';
}