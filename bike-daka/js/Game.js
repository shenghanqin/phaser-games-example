MyGame.Game = function(game) {
	this.speed = 500;
	this.gameRun = false;
	this.playGravity = 2000;
	game.score = 0;
	this.rnd = 0;
	this.createTime = 0;
	this.doubleJump = 0;
	this.dely = 0;
};
var birdchance;
var hinderchance;
var bird;


MyGame.Game.prototype = {
  create: function() {
    this.stage.backgroundColor = '#4b6687';
    this.add.image(0,0,'gameBg_'+this.rnd.integerInRange(0,2)); // 远景
    this.lou = this.add.tileSprite(0,264,1414,579,'lou_'+this.rnd.integerInRange(0,2)); // 背景大楼
    
    // 路
    this.road = this.add.tileSprite(0,game.world.height-207 - 157,game.world.width,207,'road');
    game.physics.enable(this.road,Phaser.Physics.ARCADE);
    this.road.body.immovable = true;
    this.road.body.setSize(game.world.width, 100, 0, 105);
    
    // 选手，这里为打卡鸭
    this.player = this.add.sprite(120,944, 'player');
    this.player.anchor.set(0.4,1);
    this.player.animations.add('player');
    
    //this.player.animations.stop();
  
    this.player.jump = false;
    game.physics.enable(this.player,Phaser.Physics.ARCADE); 
    this.player.body.gravity.y = 0; 
    this.player.body.setSize(100, 155, 10, 0);
    this.player.enableBody = true;
    
    // 跳跃设置
    // 旋转角度、动画，跳跃叠加
    game.input.onTap.add(this.playerJump, this);
    

    // 加载底部bar的分数。在UI.js里面定义的
    GameUI.Game_element();
    
    // 障碍物
    this.hinderGroup = game.add.group();
    this.hinderGroup.enableBody = true;
    
    // 顶部标题
    this.proName = this.add.text(game.world.width/2,46,'骑行方阵',{font: "bold 38px Microsoft YaHei", fill: "#5b3716",align:'center'})
    this.proName.anchor.set(0.5,0);
    this.proName.setShadow(-2, -2, '#fce64a', 0);
      
    // 小鸟
    this.birdGroup = game.add.group();
    this.birdGroup.enableBody = true;
    
    // 开始按钮上方的提示
    this.playWayGroup = this.add.group();
    this.playWayGroup.x = 80;
    this.playWayGroup.y = 200;
    this.playWayGroup.create(0, 0, 'play_way');
    
    // 开始Ann
    this.startBtn = this.add.button(120,370,'ico',function(){
      // 隐藏提示图片
      this.playWayGroup.visible = false;

      // 开始游戏
      this.startGame()
    },this);

    // 图片
    this.startBtn.frameName = 'start.png';
    
    // 将开始按钮放在提示图片上
    this.playWayGroup.addChild(this.startBtn);
    
    //this.playWayGroup.visible = false;
   

    // 加？？？，在UI.js里面定义的
    GameUI.cutscenes();
      
  },
  
  // 开始游戏
  startGame : function(){
    this.gameRun = true;
    this.player.animations.play('player',7,true);
    this.player.body.gravity.y = this.playGravity;
    this.road.autoScroll(-this.speed,0);
    this.lou.autoScroll(-this.speed/10,0);
  },

  // 更新游戏
  update: function() {
    game.physics.arcade.collide(this.player,this.road, this.hitRoad, null, this); //检测与陆地碰撞

    if(!this.gameRun) re
    turn;
    this.createHinder();
    this.createBrid();
    game.scoreText.setText((game.score++)/1000+' Km');
    game.physics.arcade.overlap(this.player, this.hinderGroup, this.hitHider, null, this);
    game.physics.arcade.overlap(this.player, this.birdGroup, this.hitBird, null, this);

  },
  playerJump : function(){
    if(!this.player.jump && this.gameRun)
    {
      this.player.body.velocity.y = -1000;
      game.add.tween(this.player).to({angle:-10}, 100, Phaser.Easing.Linear.None, true,0);
      if(this.doubleJump>=1)
      {
        this.player.jump = true;
      }
      else
      {
        ++this.doubleJump
      }
    }
  },
  hitRoad : function(){
    // 掉落在地上，扶正身体
    game.add.tween(this.player).to({angle:0}, 30, Phaser.Easing.Linear.None, true,0);
    this.doubleJump = 0;
    this.player.jump = false;
  },

  // 创建障碍物
  createHinder : function(){
    hinderchance= Math.random() * 1000;

    // 障碍物
    if(hinderchance < 5)
    {
      // 实际障碍物
      var hinder = this.hinderGroup.create(game.world.width, 890, 'ico');
      hinder.frameName = 'obstacle.png';
    }
    
    // 障碍物先前移动
    this.hinderGroup.setAll('body.velocity.x', -this.speed);
    this.hinderGroup.forEach(function(i){
      i.body.setSize(36, 50, 10, 0);
      if(i.x<=0)
      {
        i.destroy()
      }
    })
  },
  createBrid : function(){
    birdchance= Math.random() * 1000;
    if(birdchance < 2)
    {

      // 创建鸟
      this.birdGroup.create(game.world.width,800, 'bird',0);
      this.birdGroup.setAll('checkWorldBounds',true); 
      this.birdGroup.setAll('outOfBoundsKill',true); 
      this.birdGroup.setAll('body.velocity.x', -this.rnd.integerInRange(400,800));
      this.birdGroup.callAll('animations.add', 'animations', 'spin', [0, 1], 10, true);
      this.birdGroup.callAll('animations.play', 'animations', 'spin');
    }
  },

  // 游戏结束
  gameover : function(){
    this.gameRun = false;
    // 选手动画停止
    this.player.animations.stop();

    // 路不动
    this.road.autoScroll(0,0);
    // 楼不动
    this.lou.autoScroll(0,0);

    // 运动的物体都清零
    this.player.body.velocity.y = 0;
    this.hinderGroup.setAll('body.velocity.x', 0);
    this.birdGroup.setAll('body.velocity.x', 0);
    this.hinderGroup.setAll('body.velocity.y', 0);
    this.birdGroup.setAll('body.velocity.y', 0);

    // 显示结果页
    game.time.events.add(Phaser.Timer.SECOND*2,function(){
      game.state.start('Result')
    }, this);
  },

  // 撞击到障碍物，游戏结束
  hitHider : function(i,itm){
    this.gameover()
    itm.body.velocity.x = 1000;
    itm.body.velocity.y = -50; 
  },

  // 撞击到小鸟，游戏结束
  hitBird : function(i,item){
    this.gameover()
    item.body.velocity.x = 1000;
    item.body.velocity.y = -50;
  },

  render : function() {
    //game.debug.body(this.player);
    /*game.debug.body(this.road);
    this.hinderGroup.forEach(function(i){
      game.debug.body(i);
    })*/
    //game.debug.body(sprite2);
	}
};

