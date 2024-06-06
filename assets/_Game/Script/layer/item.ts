
const { ccclass, property } = cc._decorator;

@ccclass
export default class item extends cc.Component {
    @property(cc.Sprite) private medalSprite: cc.Sprite = null;
    @property(cc.Label) private index: cc.Label = null;
    @property(cc.Label) private scoreLabel: cc.Label = null;

    @property(cc.SpriteFrame ) public goldMedal: cc.SpriteFrame = null;
    @property(cc.SpriteFrame ) public silverMedal: cc.SpriteFrame = null;
    @property(cc.SpriteFrame ) public bronzeMedal: cc.SpriteFrame = null;

    public score : number;

    public createItemRow(rank: number, score: number) {
        this.score = score;
        let spriteFrame: cc.SpriteFrame = null;
        switch (rank) {
            case 1:
                spriteFrame = this.goldMedal;
                break;
            case 2:
                spriteFrame = this.silverMedal;
                break;
            case 3:
                spriteFrame = this.bronzeMedal;
                break;
            default:
                spriteFrame = null;
                break;
        }
        this.medalSprite.spriteFrame = spriteFrame;

        //console.log(this.yellowFrame);
        
        this.scoreLabel.string = score.toString();

        this.index.string = rank.toString();
    }

}
