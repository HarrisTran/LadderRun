
import { GameState } from "../Enum";
import GameManager from "../manager/GameManager";

const {ccclass, property} = cc._decorator;
var MovingMode = cc.Enum({
    CIRCLE: 0,
    IDLE: 1,
    RANDOM: 2
});

@ccclass
export default class MovingTrap extends cc.Component {

    @property({type: MovingMode}) private movingMode = MovingMode.IDLE;

    speed: number = 85
    dir: number = 1
    radian: number = 90
    circleRadius: number = 120
    circleCenter: cc.Vec2 = cc.v2(0, 0)
 
    onLoad () {
        this.speed = 150//random(200, 400)
        this.dir =  1
        if(this.movingMode == MovingMode.RANDOM){
            this.movingMode = Math.random() < 0.5 ? MovingMode.CIRCLE : MovingMode.IDLE;
        }
    }
 
    update(dt: number){
        if(!GameManager.Instance.isStatePlay()) return;
        if(this.dir){
            this.radian += dt * (this.speed / 100) * this.dir;
            let x = this.circleRadius * Math.cos(this.radian) + this.circleCenter.x;
            let y = this.circleRadius * Math.sin(this.radian) + this.circleCenter.y;
            if(this.movingMode == MovingMode.CIRCLE){
                this.node.position = cc.v3(x, y, 0);
            }
            //let angle = Math.atan2(y, x) / (Math.PI / 180);
            //this.body.angle = angle;
        }
        
    }
 
}
