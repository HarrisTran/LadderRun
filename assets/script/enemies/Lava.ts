import { ENUM_GAME_STATUS } from "../Enum";
import DataManager from "../manager/DataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Lava extends cc.Component {
   
    private _cameraNode : cc.Node = null;
    private _isStarted : boolean = false;
    
    // public resume(lengthOfFloor: number){
    //     this.heightRaisingLava = (lengthOfFloor+1)*350;
    //     cc.tween(this.node)
    //     .by(this.heightRaisingLava/70,{position: new cc.Vec3(0,this.heightRaisingLava)})
    //     .start();
    // }
    protected onLoad(): void {
        this._cameraNode = cc.find("Canvas/MAIN/camera");
        this.scheduleOnce(()=>this._isStarted = true,5)
    }


    protected update(dt: number): void {
        if(!this._isStarted) return;
        if(DataManager.instance.status === ENUM_GAME_STATUS.UNRUNING) return;
        if(this.node.position.y > this._cameraNode.position.y) return;
        let currenty = this.node.position.y;
        this.node.setPosition(0,currenty+dt*100);
    }


}
