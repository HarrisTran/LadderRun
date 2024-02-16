
const {ccclass, property} = cc._decorator;

@ccclass
export default class Lava extends cc.Component {
    heightRaisingLava : number = 0;
    
    public resume(lengthOfFloor: number){
        this.heightRaisingLava = (lengthOfFloor+1)*350;
        cc.tween(this.node)
        .by(this.heightRaisingLava/70,{position: new cc.Vec3(0,this.heightRaisingLava)})
        .start();
    }
}
