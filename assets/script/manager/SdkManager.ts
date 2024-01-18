export default class SdkManager {
    public static _instance:SdkManager = null

    public static get instance(){
        if (null == this._instance) {
            this._instance = new SdkManager();
        }
        return this._instance
    }

    shareMsg: string = '你敢来挑战吗？据说没有人能够爬上100层！'
    // 激励视频
    videoId: string = ''
    private videoAd = null
    // 插屏
    interstitialId: string = ''
    private interstitialAd = null
    // 横幅
    bannerId: string = ''
    private bannerAd = null

    // 主动分享
    activeShare() {
        if (typeof window['wx'] === 'undefined') {
            console.log('【主动分享】仅支持微信平台!')
            return
        }
        window['wx'].shareAppMessage({
            title: this.shareMsg
        });
    }

    // 被动分享
    passiveShare() {
        if (typeof window['wx'] === 'undefined') {
            console.log('【被动分享】仅支持微信平台!')
            return
        }
        window['wx'].showShareMenu({
            success: (res: any) => {},
            fail: (res: any) => {}
        });
        window['wx'].onShareAppMessage(() => {
            return {
                title: this.shareMsg
            }
        });
    }

    // 跳转
    turnToApp(appId: string){
        if (typeof window['wx'] === 'undefined') {
            console.log('【程序跳转】仅支持微信平台!', appId)
            this.turnToBrowser(appId)
            return
        }
        window['wx'].navigateToMiniProgram({
            appId: appId
        });
    }

    // 浏览器跳转
    turnToBrowser(url: string){
        window.open(url)
    }


    // 初始化横幅
    initBannerAd(){
        if(typeof window['wx'] === 'undefined') {
            console.log('【流量主横幅初始化】仅支持微信平台!')
            return
        }
        if(this.bannerId == ''){
            console.log('【流量主】请配置横幅广告ID')
            return
        }
        let winSize = window['wx'].getSystemInfoSync();
        if(this.bannerAd == null){
            this.bannerAd = window['wx'].createBannerAd({
                adUnitId: this.bannerId,
                adIntervals: 10,
                style: {
                    height: winSize.windowHeight - 80,
                    left: 0,
                    top: 500,
                    width: winSize.windowWidth
                }
            });
            this.bannerAd.onResize((res: any) => {
                this.bannerAd.style.top = winSize.windowHeight - this.bannerAd.style.realHeight;
                this.bannerAd.style.left = winSize.windowWidth / 2 - this.bannerAd.style.realWidth / 2;
            });
            this.bannerAd.onError((err: any) => {
                console.error('【流量主横幅】初始化有误')
            });
        }
    }

    // 横幅展示
    toggleBannerAd(isShow: boolean){
        if(typeof window['wx'] === 'undefined') {
            console.log('【流量主横幅】仅支持微信平台!')
            return
        }
        if(this.bannerAd){
            isShow ? this.bannerAd.show() : this.bannerAd.hide();
        }
    }

    // 初始化插屏
    initInterstitialAd(){
        if(typeof window['wx'] === 'undefined') {
            console.log('【流量主插屏初始化】仅支持微信平台!')
            return
        }
        if(this.interstitialId == ''){
            console.log('【流量主】请配置插屏广告ID')
            return
        }
        if(this.interstitialAd == null){
            this.interstitialAd = window['wx'].createInterstitialAd({
                adUnitId: this.interstitialId
            });
            this.interstitialAd.onError((err: any)=>{
                console.error('【流量主插屏】初始化有误')
            });
        }
    }
    
    // 插屏展示
    showInterstitialAd(){
        if (typeof window['wx'] === 'undefined') {
            console.log('【流量主插屏】仅支持微信平台!')
            return
        }
        if(this.interstitialAd){
            this.interstitialAd.show().catch((err: any)=>{
                console.error('【流量主插屏】加载失败')
            });
        }
    }

    // 初始化激励
    initVideoAd(){
        if(typeof window['wx'] === 'undefined') {
            console.log('【流量主激励初始化】仅支持微信平台!')
            return
        }
        if(this.videoId == '') {
            console.log('【流量主】请配置激励视频广告ID')
            return
        }
        if(this.videoAd == null){
            this.videoAd = window['wx'].createRewardedVideoAd({
                adUnitId: this.videoId
            });
            this.videoAd.onError((err: any) => {
                console.error('【流量主激励】初始化有误')
            });
        }
    }

    // 激励展示
    showVideoAd(success: any, fail?: any){
        if (typeof window['wx'] === 'undefined') {
            console.log('激励模拟成功1')
            return success && success()
        }
        if(this.videoAd){
            this.videoAd.offClose();
            this.videoAd.onClose((res: any) => {
                this.videoAd.offClose();
                if (res && res.isEnded || res === undefined) {
                    return success && success()
                }else {
                    return fail && fail()
                }
            });
            this.videoAd.show().catch(() => {
                this.videoAd.load()
                .then(() => this.videoAd.show())
                .catch((err: any) => {
                    console.log('广告展示失败')
                })
            });
        }else{
            console.log('激励模拟成功2')
            return success && success()
        }
    }

    /**
     * 获取排行榜
     */
    getRank() {
        if (typeof window['wx'] === 'undefined') {
            console.log('【获取排名】仅支持微信平台!')
            return
        }
        window['wx'].postMessage({
            event: 'getRank'
        })
    }

    /**
     * 设置排名
     * @param data 关卡数
     */
     setRank(data: number) {
        if (typeof window['wx'] === 'undefined') {
            console.log('【设置排名】仅支持微信平台!', data)
            return
        }
        window['wx'].postMessage({
            event: 'setScore',
            score: data
        })
    }
}

