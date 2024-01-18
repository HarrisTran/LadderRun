// Created by carolsail

import PoolManager from "./PoolManager";

export default class AlertManager {

    private static _instance: any = null

    static getInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this()
        }

        return this._instance
    }

    static get instance() {
        return this.getInstance<AlertManager>()
    }

    private alertbox: cc.Node = null
    private box: cc.Node = null
    private speed: number = 0.3

    show(text: string = '', callback?: () => void){
        // canvas
        const canvas = cc.director.getScene().getComponentInChildren(cc.Canvas);
        // 预制体生成节点
        this.alertbox = PoolManager.instance.getNode('alertbox', canvas.node)
        this.box = this.alertbox.getChildByName('box')
        const buttons = this.box.getChildByName('buttons')
        const label = this.box.getChildByName('tip').getComponent(cc.Label)
        const submitBtn = buttons.getChildByName('submit')
        const cancelBtn = buttons.getChildByName('cancel')
        label.string = `${text}`
        // 确定
        submitBtn.on('click', ()=>{
            this.fadeOut()
            callback && callback()
        })
        // 取消
        cancelBtn.on('click', ()=>{
            this.fadeOut()
        })
        // 动画
        this.fadeIn()
    }

    // 弹进动画
    fadeIn(){
        this.box.setScale(2);
        this.box.opacity = 0;
        let cbFadeIn = cc.callFunc(this.onFadeInFinish, this);
        let actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(this.speed, 255), cc.scaleTo(this.speed, 1.0)), cbFadeIn);
        cc.tween(this.box).then(actionFadeIn).start()
    }

    // 弹出动画
    fadeOut(){
        if(!this.box) return
        let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
        let actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(this.speed, 0), cc.scaleTo(this.speed, 2.0)), cbFadeOut);
        cc.tween(this.box).then(actionFadeOut).start()
    }

    // 弹入回调
    onFadeInFinish(){}

    // 弹出回调销毁
    onFadeOutFinish(){
        if(this.alertbox){
            this.alertbox.removeFromParent()
            this.alertbox = null
            this.box = null
        }
    }
}
