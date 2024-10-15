// KIDS WITH THE GREATEST NUMBER OF CANDIES

// There are n kids with candies. You are given an integer array candies, 
// where each candies[i] represents the number of candies the ith kid has, 
// and an integer extraCandies, denoting the number of extra candies that you have.

// Return a boolean array result of length n, where result[i] is true if, 
// after giving the ith kid all the extraCandies, they will have the greatest 
// number of candies among all the kids, or false otherwise.

// Note that multiple kids can have the greatest number of candies.


// Example 1:
// Input: candies = [2,3,5,1,3], extraCandies = 3
// Output: [true,true,true,false,true] 
// Explanation: If you give all extraCandies to:
// - Kid 1, they will have 2 + 3 = 5 candies, which is the greatest among the kids.
// - Kid 2, they will have 3 + 3 = 6 candies, which is the greatest among the kids.
// - Kid 3, they will have 5 + 3 = 8 candies, which is the greatest among the kids.
// - Kid 4, they will have 1 + 3 = 4 candies, which is not the greatest among the kids.
// - Kid 5, they will have 3 + 3 = 6 candies, which is the greatest among the kids.

// APPROACH


// CODE

var kidsWithCandies = function(candies, extraCandies) {
    const max = Math.max(...candies);
    const result = [];
    for (let i = 0; i < candies.length; i++) {
        const totalCandies = candies[i] + extraCandies;
      
        
        result.push(totalCandies >= max);
    } 
    return result;  
};

const candies = [2,3,5,1,3], extraCandies = 3
const kidsWithTheCandies = kidsWithCandies(candies,extraCandies);
console.log("KIDS WITH THE GREATEST NUMBER OF CANDIES : ", kidsWithTheCandies)


// MERGE STRING ALTERNATIVELY

// You are given two strings word1 and word2. Merge the strings by adding letters in 
// alternating order, starting with word1. If a string is longer than the other, 
// append the additional letters onto the end of the merged string.

// Return the merged string.

// Example 1:

// Input: word1 = "abc", word2 = "pqr"
// Output: "apbqcr"
// Explanation: The merged string will be merged as so:
// word1:  a   b   c
// word2:    p   q   r
// merged: a p b q c r

// APPROACH


// CODE

var mergeAlternately = function(word1, word2) {
    let result = [];
let maxLength = Math.max(word1.length, word2.length);

for(let i = 0; i < maxLength; i++){
   if(word1[i]) result.push(word1[i])
   if(word2[i]) result.push(word2[i])
}

return result.join('')
};


const word1 = "abc", word2 = "pqr"
const completeWord = mergeAlternately(word1, word2);
console.log("MERGE STRING ALTERNATIVELY : ",completeWord)