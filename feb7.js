// REVERSE WORDS IN STRING

// Given an input string s, reverse the order of the words.

// A word is defined as a sequence of non-space characters. The words in s will be separated by at least one space.

// Return a string of the words in reverse order concatenated by a single space.

// Note that s may contain leading or trailing spaces or multiple spaces between two words. 
// The returned string should only have a single space separating the words. 
// Do not include any extra spaces.

// Example 1:
// Input: s = "the sky is blue"
// Output: "blue is sky the"

// Example 2:
// Input: s = "  hello world  "
// Output: "world hello"
// Explanation: Your reversed string should not contain leading or trailing spaces.

// APPROACH




// CODE


var reverseWords = function(s) {
    let array= s.split(' ');
    let reverse = ''
    for (let i=array.length-1;i>=0;i--){
        if(array[i] === '') continue;
        if(reverse.length>0) {
            reverse+=' '
        }
       
        reverse += array[i]
    }
     return reverse
};

const Input_s = "the sky is blue";
const outputForReverseWordsInString = reverseWords(Input_s);
console.log("REVERSE WORDS IN STRING : ", outputForReverseWordsInString);


// CAN PLACE FLOWERS

// You have a long flowerbed in which some of the plots are planted, and some are not. 
// However, flowers cannot be planted in adjacent plots.

// Given an integer array flowerbed containing 0's and 1's, where 0 means empty and 1 means not empty, 
// and an integer n, return true if n new flowers can be planted 
// in the flowerbed without violating the no-adjacent-flowers rule and false otherwise.


// Example 1:
// Input: flowerbed = [1,0,0,0,1], n = 1
// Output: true

// Example 2:
// Input: flowerbed = [1,0,0,0,1], n = 2
// Output: false

// APPROACH



// CODE

var canPlaceFlowers = function(flowerbed, n) {
    for (let i = 0; i < flowerbed.length && n !== 0; i++) {
    if (
      flowerbed[i] === 0 &&
      flowerbed[i - 1] !== 1 &&
      flowerbed[i + 1] !== 1
    ) {
      n--;
      i++;
    }
  }
  return n === 0;
};

const flowerbed = [1,0,0,0,1], n = 1
const floweredOutput = canPlaceFlowers(flowerbed, n);
console.log(" CAN PLACE FLOWERS: ",floweredOutput)