# PhaserGame
目前阶段就是记录学习phaser的笔记和问题记录
在官方example中animation下creature dragon multiple.js和creature-dragon.js在本地无法运行，在 game.add.creature这里不运行了.      后来发现是用的phaserjs文件版本比例子新，新版本中同样效果如何实现还要探究。 最终确定 是文件版本不同但不是新旧的问题，例子用的是phaser.2.4.7.complete.min.js，试验的时候用的是phaser_2_6_2.min.js，关键不是2××这个版本号，而是complete，每一版本的complete版都是比单纯版整合了更多的东西，这里还用2.6.2但加上phaser-creature.2.6.2.min.js和creature.2.6.2.min.js文件就可以了。
notedScripts文件夹是学习实例时候做了笔记的脚本备份
一些示例脚本要结合插件 未深究
phaser的本体支持box2d但是并没有嵌入box2d，还要自行添加box2d的本体
