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
