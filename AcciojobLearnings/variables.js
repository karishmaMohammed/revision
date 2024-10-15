// GEC => Global execution of code
// segrigate global variables in memory colum and call stack
// while hoisting initial values of let/const are uninitialised where var is undefined
// order of hoisting first comes regular functions then var variables so on so forth..
// revise concept of scoping
// window is global object in browser

var x = 2;

const abc = (l) => {
    let h =2;
    if(h<l){
        let y = 4;
        console.log(y+x);
        var z = 3;
    }
    if(z<l){
        const u = 3;
        x = z+u+l
        console.log(x)
    }
    return h+x
}

let h = abc(4)+x

console.log(h)


// DOM => Document object model
// DOM API's are the application programming interface where they interact with application do some task done
// for you by this any function which does job done/task done for you is called an API
// Examples of DOM API
// document.querySelector('#__index .announce')
// explanation querySelector search on entire DOM and fetch # refer id of div index gets its child having
// class name announce it works in DFS algo (depth)
// different between shallow and deep copy
let obj = {
    a:1,
    b:2
}
let obj1 = obj // in this case only reference shared  can access values
console.log(obj1.a)

let obj2 = {
    a:1,
    b:2,
    x:{
        p:3,
        y:{
            k:8
        }
    }
}
let obj3 = { ... obj2} //shallow copy this copies only one level cant go inner levels
delete obj2.x;
console.log(obj3.x.y.k)
