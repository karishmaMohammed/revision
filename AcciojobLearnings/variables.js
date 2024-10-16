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

//deep copy revise this topic

// call, apply and bind
// oops in javascript
// this key word is a object refer to current scope (it remember who called it)

// console.log(this) => o/p {}, prints global scope which is window object

// function abc(){ // writing a function in global space which does't have any parent
//     console.log(this)
// }
// abc() // prints global scope which is window object 

// function xyz(){
//     function abc(){
//         console.log(this)
//     }
//     abc()
// }        o/p => // prints global scope which is window object 
// xyz()

// note = > it does't matter where it is wriiten it matters from it is called

// write a function call inside object

const object = {
    name:"ABC",
    printName:function(){
        console.log(this) 
    }
}
object.printName()

// revise concept of call, apply and bind

// how "this" works in arrow function
// apply(reference, [no. of argument/parameters])

// class Human{
//     constructor(){
//         console.log(this) // this keyword by default it returns

//         return 2 // when u retun primitive variable it returns empty object bcs new keyword assign empty object
//         // whereas returning non primitive variable like array/object it return exact those 
//         // this is how "this" works
//     }
// }

// const person = new Human() // new keyword creates empty object

// console.log(person)

class Human{
    constructor(eyeColor, skinColor, gender, lang){
        this.hand =2
        this.eye = eyeColor
        this.color = skinColor
        this.gender = gender
        this.speak = function(proficiency){
           console.log(proficiency + " " + lang) 
        }
    }
}

const person1 = new Human("black","cream","F","english")
const person2 = new Human("browm","black","M","Hindi")
console.log(person1);
console.log(person2.speak("fluent"));