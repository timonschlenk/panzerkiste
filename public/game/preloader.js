export default class Preloader extends Phaser.Scene{
    constructor(){
        super("preloader");
    }

    preload(){
        this.load.path = "/public/assets/";
        this.load.image("Hull_01_A", "Hulls_Color_A/Hull_01.png");
        this.load.image("Gun_01_A", "Weapon_Color_A/Gun_01.png");
        this.load.image("Hull_01_B", "Hulls_Color_B/Hull_01.png");
        this.load.image("Gun_01_B", "Weapon_Color_B/Gun_01.png");
        this.load.image("Hull_01_C", "Hulls_Color_C/Hull_01.png");
        this.load.image("Gun_01_C", "Weapon_Color_C/Gun_01.png");
        this.load.image("Hull_01_D", "Hulls_Color_D/Hull_01.png");
        this.load.image("Gun_01_D", "Weapon_Color_D/Gun_01.png");
        this.load.image("Medium_Shell", "Effects/Medium_Shell.png");
        this.load.spritesheet("Track_1_A", "Tracks/Track_1_A.png", { frameWidth: 42, frameHeight: 246 });
        this.load.image("tiles", "tilesExtruded.png");
        this.load.tilemapTiledJSON("map", "panzerkiste.json");
    }
}