// PROMISES Interview Question

// synchronous vs asynchronous code

//Synchronous code
console.log("start")
console.log("Subscribe to Roadside Coder")
console.log("stop")

// Asynchronous code with setTimeout
console.log("start")

setTimeout(() => {
  console.log("Subscribe to Roadside Coder");
}, 2000); 

console.log("stop");

// Asnychronous Example
console.log("start")

function importantAction(username) {
    setTimeout(() => {
      return `Subscribe to ${username}`;
    }, 1000);
  }

const message1 = importantAction('Roadside Coder');
console.log(message1);

console.log("stop");


// Callback

console.log("start")

function importantAction(username, cb) {
  setTimeout(() => {
    cb( `Subscribe to ${username}`);
  }, 1000);
}

importantAction("Roadside Coder", (message) => {
  console.log(message);
});

console.log("stop")


// Callback Hell
console.log("start")

function importantAction(username, cb) {
  setTimeout(() => {
    cb(`Subscribe to ${username}`);
  }, 1000);
}

function likeTheVideo(video, cb) {
  setTimeout(() => {
    cb(`Like the ${video} video`);
  }, 1000);
}

function shareTheVideo(video, cb) {
  setTimeout(() => {
    cb(`Share the ${video} video`);
  }, 1000);
}

const message = importantAction("Roadside Coder", (message) => {
  console.log(message);
  likeTheVideo("Javascript Interview Questions", (action) => {
    console.log(action);
    shareTheVideo("Javascript Interview Questions", (action) => {
        console.log(action);
      });
  });
}); 

console.log("stop")


// Promises

console.log("start");

const sub = new Promise((resolve, reject) => {
  setTimeout(() => {
    const result = true;
    if (result) resolve("Subscribed to Roadside Coder");
    else reject(new Error("Why aren't you subscribed to Roadside Coder?"));
  }, 2000);
});

sub
  .then((message) => {
    console.log(message);
  })
  .catch((err) => {
    console.log(err);
});

console.log("stop");


// Rewriting Callbacks

console.log("start");

function importantAction(username) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Subscribe to ${username}`);
    }, 1000);
  });
}

function likeTheVideo(video) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Like the ${video} video`);
    }, 1000);
  });
}

function shareTheVideo(video) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Share the ${video} video`);
    }, 1000);
  });
}

importantAction("Roadside Coder").then((res) => {
  console.log(res);
  likeTheVideo("Javascript Interview Questions").then((res) => {
    console.log(res);
    shareTheVideo("Javascript Interview Questions").then((res) => {
      console.log(res);
    });
  });
}).catch(err=>console.log(err))

console.log("stop");


// Promise Chaining

importantAction("Roadside Coder").then((res) => {
    console.log(res);
    return likeTheVideo("Javascript Interview Questions")
  }).then((res) => {
      console.log(res);
      return shareTheVideo("Javascript Interview Questions")
    }).then((res) => {
        console.log(res);
});


// Promise Combinator

// promise.all()
console.log("start")

Promise.all([
  importantAction("Roadside Coder"),
  likeTheVideo("Javascript Interview Questions"),
  shareTheVideo("Javascript Interview Questions")
]).then((res)=>{
  console.log(res)
}).catch(err=>{
  console.log(err)
})

console.log("stop")


// promise.race()
console.log("start")

Promise.race([
  importantAction("Roadside Coder"),
  likeTheVideo("Javascript Interview Questions"),
  shareTheVideo("Javascript Interview Questions")
]).then((res)=>{
  console.log(res)
}).catch(err=>{
  console.log(err)
})

console.log("stop")


// promise.allSettled()
console.log("start")

Promise.allSettled([
  importantAction("Roadside Coder"),
  likeTheVideo("Javascript Interview Questions"),
  shareTheVideo("Javascript Interview Questions")
]).then((res)=>{
  console.log(res)
}).catch(err=>{
  console.log(err)
})

console.log("stop")


// promise.any()
console.log("start")

Promise.any([
  importantAction("Roadside Coder"),
  likeTheVideo("Javascript Interview Questions"),
  shareTheVideo("Javascript Interview Questions")
]).then((res)=>{
  console.log(res)
}).catch(err=>{
  console.log(err)
})

console.log("stop");


// async & await

const result = async () => {
    try {
        const message1 = await importantAction("Roadside Coder");
        const message2 = await likeTheVideo("Javascript Interview Questions");
        const message3 = await shareTheVideo("Javascript Interview Questions");
    
            console.log({message1, message2, message3});
      } catch (err) {
        console.log(err);
      }
};
  
result();


// ----------> Interview Question


// Question 1 : What is Output?

console.log('start');

const promise10 = new Promise((resolve, reject) => {
  console.log(1)
  resolve(2)
})

promise10.then(res => {
  console.log(res)
})

console.log('end');


// Question 2 : What is Output?

console.log('start');

const promise2 = new Promise((resolve, reject) => {
  console.log(1)
  resolve(2)
  console.log(3)
})

promise2.then(res => {
  console.log(res)
})

console.log('end');


// Question 3 : What is Output?

console.log('start')

const fn = () => (new Promise((resolve, reject) => {
  console.log(1);
  resolve('success')
}))

console.log('middle')

fn().then(res => {
  console.log(res)
})

console.log('end')


// Question 4 : What is Output?

function job() {
    return new Promise(function(resolve, reject) {
        reject();
    });
}

let promise3 = job();

promise3

.then(function() {
    console.log('Success 1');
})

.then(function() {
    console.log('Success 2');
})

.then(function() {
    console.log('Success 3');
})

.catch(function() {
    console.log('Error 1');
})

.then(function() {
    console.log('Success 4');
});


// Question 5 : What is Output?

function job(state) {
    return new Promise(function(resolve, reject) {
        if (state) {
            resolve('success');
        } else {
            reject('error');
        }
    });
}

let promise4 = job(true);

promise4
.then(function(data) {
    console.log(data);

    return job(false);
})

.catch(function(error) {
    console.log(error);

    return 'Error caught';
})

.then(function(data) {
    console.log(data);

    return job(true);
})

.catch(function(error) {
    console.log(error);
});


// Question 6 : What is the Output?

function job(state) {
    return new Promise(function(resolve, reject) {
        if (state) {
            resolve('success');
        } else {
            reject('error');
        }
    });
}

let promise = job(true);

promise
.then(function(data) {
    console.log(data);

    return job(true);
})
.then(function(data) {
    if (data !== 'victory') {
        throw 'Defeat';
    }
    return job(true);
})
.then(function(data) {
    console.log(data);
})
.catch(function(error) {
    console.log(error);
    return job(false);
})
.then(function(data) {
    console.log(data);
    return job(true);
})
.catch(function(error) {
    console.log(error);
    return 'Error caught';
})
.then(function(data) {
    console.log(data);
    return new Error('test'); // Not Returning a promise
})
.then(function(data) {
    console.log('Success:', data.message);
})
.catch(function(data) {
    console.log('Error:', data.message);
});


// Question 7 : Promises Chaining

const firstPromise = new Promise((resolve, reject) => {
    resolve('First!');
});

const secondPromise = new Promise((resolve, reject) => {
    resolve(firstPromise);
})

secondPromise
    .then(res => res)
    .then(res => console.log(res));


// Question 8 : Rewrite this example code using `async/await`
    //  Instead of `.then/catch`

function loadJson(url) {
        return fetch(url)
          .then(response => {
            if (response.status == 200) {
              return response.json();
            } else {
              throw new Error(response.status);
            }
          });
}
      
loadJson('https://javascript.info/no-such-user.json').catch(alert); 

// Answer
async function loadJson(url) { // (1)
    let response = await fetch(url); // (2)
  
    if (response.status == 200) {
      let json = await response.json(); // (3)
      return json;
    }
  
    throw new Error(response.status);
}
  
loadJson('https://javascript.info/no-such-user.json').catch(alert); 


// Question 9 : Solve Promise Recursively

function importantAction(username) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`Subscribe to ${username}`);
      }, 1000);
    });
  }
  
  function likeTheVideo(video) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`Like the ${video} video`);
      }, 1000);
    });
  }
  
  function shareTheVideo(video) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`Share the ${video} video`);
      }, 1000);
    });
  }
  
  function promRecurse(funcPromises) {
    if (funcPromises.length === 0) return;
    const promi = funcPromises.shift();
  
    promi.then((result) => console.log(result)).catch((err) => console.log(err));
  
    promRecurse(funcPromises);
  }
  
  promRecurse([
    importantAction("Roadside Coder"),
    likeTheVideo("Javascript Interview Questions"),
    shareTheVideo("Javascript Interview Questions"),
]);


// Question 10 : Promise Polyfill

function PromisePolyFill(executor) {
    let onResolve,
        onReject,
        fulfilled = false,
        rejected = false,
        called = false,
        value;
  
    function resolve(v) {
      fulfilled = true;
      value = v;
      
      if (typeof onResolve === "function") { // for async
        console.log("inside resolve")
        onResolve(value);
        called = true;
      }
    }
  
    function reject(reason) {
      rejected = true;
      value = reason;
  
      if (typeof onReject === "function") {
        onReject(value);
        called = true;
      }
    }
  
    this.then = function (callback) {
      onResolve = callback;
  
      if (fulfilled && !called) { // for sync
        console.log("inside then")
        called = true;
        onResolve(value);
      }
      return this;
    };
  
    this.catch = function (callback) {
      onReject = callback;
  
      if (rejected && !called) {
        called = true;
        onReject(value);
      }
      return this;
    };
  
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  
  const promise1 = new PromisePolyFill((resolve, reject) => {
    console.log(1)
    setTimeout(() => {
        resolve(2)
      }, 1000);
    console.log(3)
  })
  
  promise1.then(res => {
    console.log(res)
});

const examplePromise = new PromisePolyFill((resolve, reject) =>{
    resolve(2);
});

examplePromise.then((res) => console.log(res)).catch(err => console.error(err));

PromisePolyFill.resolve = (val) => new PromisePolyFill(function executor(resolve, reject){
    resolve(val);
});

PromisePolyFill.reject = (val) => new PromisePolyFill(function executor(resolve, reject){
    reject(val);
});


// promise.all()

PromisePolyFill.all = (promises) => {
    let fulfilledPromises = [],
      result = [];
  
    function executor(resolve, reject) {
      promises.forEach((promise, index) =>
        promise
          .then((val) => {
            fulfilledPromises.push(true);
            result[index] = val;
  
            if (fulfilledPromises.length === promises.length) {
              return resolve(result);
            }
          })
          .catch((error) => {
            return reject(error);
          })
      );
    }
    return new PromisePolyFill(executor);
};