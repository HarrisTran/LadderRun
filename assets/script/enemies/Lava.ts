
const {ccclass, property} = cc._decorator;

@ccclass
export default class Lava extends cc.Component {
   
    private _cameraNode : cc.Node = null;
    
    // public resume(lengthOfFloor: number){
    //     this.heightRaisingLava = (lengthOfFloor+1)*350;
    //     cc.tween(this.node)
    //     .by(this.heightRaisingLava/70,{position: new cc.Vec3(0,this.heightRaisingLava)})
    //     .start();
    // }
    protected onLoad(): void {
        this._cameraNode = cc.find("Canvas/MAIN/camera");
    }

    protected update(dt: number): void {
        if(this.node.position.y > this._cameraNode.position.y) return;
        let currenty = this.node.position.y;
        this.node.setPosition(0,currenty+dt*100);
    }


}
