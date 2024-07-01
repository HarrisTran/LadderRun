
const {ccclass, property} = cc._decorator;

@ccclass
export default class LuckyWheel extends cc.Component {
    @property(sp.Skeleton) private animation: sp.Skeleton = null;
    @property(cc.Sprite) private items: cc.Sprite[] = [];


    protected onEnable(): void {

        this.animation.setAnimation(0,'appear',false);
        this.animation.addAnimation(0,'idle',true);
    }

    public spin(){
        this.animation.setAnimation(0,'spin',true);
        setTimeout(() => {
            this.animation.setAnimation(0,'stop',false);
        }, 5000);
    }

}
