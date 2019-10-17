function myObservable(observer) {
    let i = 0;
    const id = setInterval(() => {
        if(i < 10) {
            observer.next(i++);
        } else {
            observer.complete();
            clearInterval(id);
        }
    }, 10);
}

const observer = {
    next: v => console.log(`next -> ${v}`),
    error: () => {},
    complete: () => console.log('complete'),
};

myObservable(observer);