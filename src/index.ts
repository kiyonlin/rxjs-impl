class SafeObserver {
    private destination: any;
    private isUnsubscribed: boolean;

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
            this.isUnsubscribed = true;
            if(destination.error) {
                destination.error(err);
            }
        }
    }

    complete() {
        const destination = this.destination;
        if(!this.isUnsubscribed) {
            this.isUnsubscribed = true;
            if(destination.complete) {
                destination.complete();
            }
        }
    }
}

function myObservable(observer) {
    let safeObserver = new SafeObserver(observer);
    let i = 0;
    const id = setInterval(() => {
        if(i < 10) {
            safeObserver.next(i++);
        } else {
            safeObserver.complete();
            safeObserver.next('stop me!!!');
            clearInterval(id);
        }
    }, 10);

    return () => {
        console.log('disposed!');
        clearInterval(id);
    }
}

const observer = {
    next: v => console.log(`next -> ${v}`),
    error: () => {},
    complete: () => console.log('complete'),
};

const unsub = myObservable(observer);
// setTimeout(unsub, 55);