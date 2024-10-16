/*
    Hi.
    This is a set of practice exercises.
    The purpose is to focus on a few things at a time.
    You do this by writing your answer after a task is given (see the example).

    DO NOT change any code that is provided unless the task specifically says so.
*/

/* -----------------------------------------------------------------------------
    Task: Example
    Write the code to print all the names in the list, one name per line
*/
console.log("Task: Example");
const people = ["Tony", "Christian", "Håkon"]

for (let index = 0; index < people.length; index++) {
    let person = people[index];
    console.log(person);
}

/* -----------------------------------------------------------------------------
    Task: A
    Create a function that returns an array of length m-n, 
    n is the min value. 
    m is the max value. 
    if n = 5 and m is 10 the returned array sholuld be [5,6,7,8,9]
    Use loops and arrays to achive the goal. 
*/
console.log("Task: A");

function makeArray(n, m){

    let array = [];

for (let i=n; i<m; i++){
    array.push(i);
} 
return array;
}

console.log(makeArray(5,10));

/* -----------------------------------------------------------------------------
    Task: B
    Create two arrays using your function from task a.
    first array n = 5, m = 11
    second array n = 8, m = 23
    
    Create a function that combines the two arrays into one, but no duplicate values. 
    Use for loops
*/
console.log("Task: B");

function mergeArraysWithoutDuplicates(array1, array2){
    let mergedArray = [];

    for (let i = 0; i < array1.length; i++){
        let isDuplicate = false;
        for (let j = 0; j < mergedArray.length; j++){
            if (array1[i] === mergedArray[j]){
                isDuplicate = true
            }
        }
        if (!isDuplicate){
            mergedArray.push(array1[i]);
        }
    }
    for (let i=0; i < array2.length; i++){
        let isDuplicate = false;
        for (let j = 0; j < mergedArray.length; j++){
            if (array2[i] === mergedArray[j]){
                isDuplicate = true;
            }
        }
        if (!isDuplicate){
            mergedArray.push(array2[i]);
        }
    }
    return mergedArray;
}

let array1 = makeArray (5,11);
let array2 = makeArray (8, 23);

let mergedArrayNoDuplicates = mergeArraysWithoutDuplicates(array1, array2);

console.log("Array1:", array1);
console.log("Array2:",  array2);
console.log("Merged Arrays without duplicates:", mergedArrayNoDuplicates);



/* -----------------------------------------------------------------------------
    Task: C
    Following you will find an alphabet a encrypted text and a shift value. 
    The message is encrypted using a cesar chipher https://en.wikipedia.org/wiki/Caesar_cipher 
    Create a function that 
    - Takes three parameters message, alphabet and shift 
    - Creates the key based on the alphabet and the shift value. 
    - decrypts and returns the message.
    Use arrays and for loops. 
*/
console.log("Task: C");
const ALPHABET = "abcdefghijklmnopqrstuvwxyz"
const message = "ckrr jutk"
let shift = 6

/* -----------------------------------------------------------------------------
    Task: D

    You are given a list of numbers.
    Write a function that takes the list and a target sum as input parameters
    The function is then to figure out what two numbers in the list that summed makes the provided sum.

    Example:
    [3,2,6,9]
    target 9
    -> [3,6]

*/
console.log("Task: D");

const numbers = [1, 23, 14, 56, 42, 33, 0, 3];
const target = 36;




/* -----------------------------------------------------------------------------
    Task: E
    Create a function that takes a number as inputt and returns the number of digits in that number. 
    123 -> 3
    2 -> 1
    42693 -> 5
*/
console.log("Task: E");
