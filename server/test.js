const arr1 = [{'1':1}, {'2':3}, {'3':3}]
const arr2 = [{'1': 1}, {'2': 2}, {'3': 3}]


// const checker = (arr1, arr2) => {
//     return arr1.every((val, i) => val === arr2[i])
// }
const checker = (arr1, arr2) => {
   for (let i = 0; i < arr1.length; i += 1) {
     for (let key in arr1[i]) {
       if (arr1[i][key] !== arr2[i][key]) {
         return false;
       }
     }
   }
   return true;
}
console.log(checker(arr1, arr2))
