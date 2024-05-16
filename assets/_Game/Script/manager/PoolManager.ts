// Created by carolsail

export default class PoolManager{

    private static _instance: any = null

    static getInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this()
        }

        return this._instance
    }

    static get instance() {
        return this.getInstance<PoolManager>()
    }

    private _dictPool: any = {}
    public _dictPrefab: any = {}

    public copyNode(copynode: cc.Node, parent: cc.Node | null): cc.Node {
        let name = copynode.name;
        this._dictPrefab[name] = copynode;
        let node = null;
        if (this._dictPool.hasOwnProperty(name)) {
            let pool = this._dictPool[name];
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = cc.instantiate(copynode);
            }
        } else {

            let pool = new cc.NodePool();
            this._dictPool[name] = pool;

            node = cc.instantiate(copynode);
        }
        if (parent) {
            node.parent = parent;
            node.active = true;
        }
        return node;
    }

    public getNode(prefab: cc.Prefab | string, parent?: cc.Node, pos?: cc.Vec3): cc.Node {
        let tempPre: any;
        let name: any;
        if (typeof prefab === 'string') {
            tempPre = this._dictPrefab[prefab];
            name = prefab;
            if (!tempPre) {
                console.log("Pool invalid prefab name = ", name);
                return null;
            }
        }
        else {
            tempPre = prefab;
            name = prefab.data.name;
        }

        let node = null;
        if (this._dictPool.hasOwnProperty(name)) {
            let pool = this._dictPool[name];
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = cc.instantiate(tempPre);
            }
        } else {
            let pool = new cc.NodePool();
            this._dictPool[name] = pool;

            node = cc.instantiate(tempPre);
        }

        if (parent) {
            node.parent = parent;
            node.active = true;
            if (pos) node.position = pos;
        }
        return node;
    }

    // 节点放进池子
    public putNode(node: cc.Node | null, isActive = false) {
        if (!node) {
            return;
        }

        let name = node.name;
        let pool = null;
        // node.active = isActive
        if (this._dictPool.hasOwnProperty(name)) {
            pool = this._dictPool[name];
        } else {
            pool = new cc.NodePool();
            this._dictPool[name] = pool;
        }

        pool.put(node);
    }

    public clearPool(name: string) {
        if (this._dictPool.hasOwnProperty(name)) {
            let pool = this._dictPool[name];
            pool.clear();
        }
    }

    public setPrefab(name: string, prefab: cc.Prefab): void {
        this._dictPrefab[name] = prefab;
    }

    public getPrefab(name: string): cc.Prefab {
        return this._dictPrefab[name];
    }
}
