// Hello.
// This is a set of exercises.
// The idea is to practice a few things at a time.
// You do this by writing your answer after a task is given (see the example).
// Use the concepts from our sylabus. 

// DO NOT change the provided code unless the task specifically says to do so.

/* -----------------------------------------------------------------------------
    Task: Example
    Write code to print all the names in the list, one name per line
*/
console.log("Task: Example");
const people = ["Tony", "Christian", "Håkon"]

for (let index = 0; index < people.length; index++) {
    let person = people[index];
    console.log(person);
}

/* -----------------------------------------------------------------------------
    Task: A
    create a function that "draws" a tree of a given height.
    Example the following is a tree of height 5

           5        *
           4       ***
           3      *****
           2     *******
           1        x
*/
console.log("Task: A");

function drawTree(height){
    for (let i = 1; i<height; i++){
        let spaceInput = '';
        for (let j = 0; j<height - i; j++){
            spaceInput += ' ';
        }
        for (let k = 0; k<(2*i - 1); k++){
            spaceInput += '*';
        }
        console.log(spaceInput);
    }
    let treeTrunk = '';
    for (let j = 0; j<height -1; j++){
        treeTrunk += ' ';
    }
    treeTrunk += 'x';
    console.log(treeTrunk)
}

drawTree(10);

/* -----------------------------------------------------------------------------
    Task: B

    Write a function that "draws" an arrow of a given size.
    Example: This is an arrow of size 3.

    *
    * *
    * * *
    * *
    * 
*/
console.log("Task: B");

function drawArrow(size){
    for (let i =1; i<= size; i++){
        let spaceInput = '';
        for (let j = 0; j<i; j++){
            if (j===0){
                spaceInput += '*';
            } else {
                spaceInput += ' *';
            }
        }
        console.log(spaceInput);
    }
    for (let i = size - 1; i>=1; i--){
        let spaceInput = '';
        for (let j = 0; j<i; j++){
            if (j===0){
                spaceInput += '*';
            } else {
                spaceInput += ' *';
            }
        }
        console.log(spaceInput);
    } 
}

drawArrow(6);

/* -----------------------------------------------------------------------------
    Task: C
    Write a function that draws a box of n by m dimensions. Take into acount the diffrence in aspectratio.

    Example: This is a aproximatly a 2 by 2 box. 
    +--------+
    |        |
    |        |
    +--------+
*/
console.log("Task: C");

function drawBox(n, m){
    let topOfBox = '+';
    for (let i = 0; i<m; i++){
        topOfBox += '-';
    }
    topOfBox += '+';
    console.log(topOfBox);

    for (let i = 0; i<n; i++){
        let middleOfBox = '|';
        for (let j = 0; j<m; j++){
            middleOfBox += ' ';
        }
        middleOfBox += '|';
        console.log(middleOfBox);
    }
    let bottomOfBox = '+';
    for (let i = 0; i<m; i++){
        bottomOfBox += '-';
    }
    bottomOfBox += '+';
    console.log(bottomOfBox);
}

drawBox(4,16);



/* -----------------------------------------------------------------------------
    Task: D
    Write a function that returns true if a word is a Heterogram.   
*/
console.log("Task: D");

function isItHeterogram(word){
    let letters = {};
    for (let i = 0; i<word.length; i++){
        let char = word[i].toLowerCase();
        if (char>= 'a' && char <='z'){
            if (letters[char]){
                return false;
            }
            letters[char] = true;
        }
    }
    return true;
}

console.log(isItHeterogram("house"));
console.log(isItHeterogram("hello"));



/* -----------------------------------------------------------------------------
    Task: E
    Write a function that returns true if two words are Anagrams.
*/
console.log("Task: E");

function areTheyAnagrams (word1, word2){
    function cleanTheWord(word){
        let cleaned = '';
        for (let i= 0; i<word.length; i++){
            let char = word[i].toLowerCase();
            if (char>= 'a' && char <= 'z'){
                cleaned += char;
            }
        }
        return cleaned;
    }
    function sortTheWord(word){
        let charArray = [];
        for (let i = 0; i<word.length; i++){
            charArray.push(word[i]);
        }
        for (let i = 0; i<charArray.length -1; i++){
            for (let j = 0; j<charArray.length -1 -i; j++){
                if (charArray[j]>charArray[j+1]){
                    let temp = charArray[j];
                    charArray[j] = charArray[j+1];
                    charArray[j+1] = temp;
                }
            }
        }
        return charArray.join('');
    }
    let cleanedWord1 = cleanTheWord(word1);
    let cleanedWord2 = cleanTheWord(word2);
    let sortedWord1 = sortTheWord(cleanedWord1);
    let sortedWord2 = sortTheWord(cleanedWord2);

    return sortedWord1 === sortedWord2;
}

console.log(areTheyAnagrams("listen", "silent"));
console.log(areTheyAnagrams("house", "shet"));