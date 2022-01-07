const Calculation = ( (a, b) => {
    return new Promise((resolve, reject) => {
        if(a>0 && b>0){
            resolve(a+b)
        }else{
            reject("wrong values")
        }
    })
})

// Calculation(1,-2).then(() => {
//     console.log("added")
// }).catch((e) => {
//     console.log(e)
// })


const add = async() => {
    return await Calculation(1,2)
}

add().then(() => {console.log("added")}).catch((e) =>{
    console.log(e)
})

-------------------------------------*****************************---------------------------

const buyFlightTicket = () => {
    return new Promise((resolve, reject) => {
        const val = false;
        if(val){
            resolve("hey its resolved")
        }else{
            reject("hey this is not resolved")
        }
    })
}

buyFlightTicket()
.then((sucess) => 
    console.log(sucess)
).catch((error) => 
    console.log(error)
)
