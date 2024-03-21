import { ENUM_GAME_STATUS } from "../Enum";
import { delay } from "../Utils";
import DataManager from "../manager/DataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Lava extends cc.Component {
    @property
    delayTime: number = 0;

    @property
    lavaSpeed: number = 150;
   
    private _cameraNode : cc.Node = null;
    private _isStarted : boolean = false;
    protected async onLoad() {
        this._cameraNode = cc.find("Canvas/MAIN/camera");
        await delay(this.delayTime);
        this._isStarted = true;
    }

    protected update(dt: number): void {
        if (!this._isStarted ||
            DataManager.instance.status !== ENUM_GAME_STATUS.RUNING ||
            this.node.position.y > this._cameraNode.position.y) {
            return;
        }
        let currenty = this.node.position.y;
        this.node.setPosition(0, currenty + dt * this.lavaSpeed);
    }


}
