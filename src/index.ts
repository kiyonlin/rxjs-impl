function myObservable(observer) {
    for(let i = 0; i < 10; i++) {
        observer.next(i);
    }
    observer.complete();
}

const observer = {
    next: v => console.log(`next -> ${v}`),
    error: ()=>{},
    complete: () => console.log('complete'),
};

myObservable(observer);