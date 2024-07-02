
const {ccclass, property} = cc._decorator;

@ccclass
export default class LuckyChain extends cc.Component {
    @property(sp.Skeleton) animation : sp.Skeleton = null;
    @property([cc.Node]) sprites: cc.Node[] = [];

    protected onLoad(): void {
        this.animation.setEventListener((_: sp.spine.TrackEntry, e: sp.spine.Event)=>{
            switch (e.data.name) {
                case 'card-claimed':
                    
                    break;
            
                case 'new-card-spawned':
                    break;
            }
        })
    }

    protected onEnable(): void {
        this.animation.setAnimation(0,'appear',false);
        this.animation.addAnimation(0,'idle',true);

        setTimeout(() => {
            this.animation.addAnimation(0,'active',true);
        }, 2000);
    }
}
