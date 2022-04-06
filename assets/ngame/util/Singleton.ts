export default class Singleton {
    public static ins<T extends {}>(this: new () => T): T {
        if (!(<any>this).instance) {
            (<any>this).instance = new this();
        }
        return (<any>this).instance;
    }

    public static dins() {
        (<any>this).instance = null;
    }
}

