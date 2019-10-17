class SafeObserver {
    private destination: any;
    private isUnsubscribed: boolean;
    public _unsubscribe: any;

    constructor(destination) {
        this.destination = destination;
    }

    next(v) {
        const destination = this.destination;
        if(destination.next && !this.isUnsubscribed) {
            destination.next(v);
        }
    }

    error(err) {
        const destination = this.destination;
        if(!this.isUnsubscribed) {
            if(destination.error) {
                destination.error(err);
            }
            this.unsubscribe();
        }
    }

    complete() {
        const destination = this.destination;
        if(!this.isUnsubscribed) {
            if(destination.complete) {
                destination.complete();
            }
            this.unsubscribe();
        }
    }

    unsubscribe() {
        this.isUnsubscribed = true;
        if(this._unsubscribe) {
            this._unsubscribe();
        }
    }
}

class Observable {
    private _subscribe: any;

    constructor(_subscribe) {
        this._subscribe = _subscribe;
    }

    subscribe(observer) {
        const safeObserver = new SafeObserver(observer);
        safeObserver._unsubscribe = this._subscribe(safeObserver);
        return () => safeObserver.unsubscribe();
    }
}

const myObservable = new Observable((observer) => {
    let i = 0;
    const id = setInterval(() => {
        if(i < 10) {
            observer.next(i++);
        } else {
            observer.complete();
            observer.next('stop me!!!');
            clearInterval(id);
        }
    }, 10);

    return () => {
        console.log('disposed!');
        clearInterval(id);
    }
});

const observer = {
    next: v => console.log(`next -> ${v}`),
    error: () => {},
    complete: () => console.log('complete'),
};

const unsub = myObservable.subscribe(observer);
setTimeout(unsub, 55);