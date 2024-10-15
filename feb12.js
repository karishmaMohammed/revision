// KEYBOARD ROW

// Given an array of strings words, return the words that can be typed using letters 
// of the alphabet on only one row of American keyboard like the image below.

// In the American keyboard:

// the first row consists of the characters "qwertyuiop",
// the second row consists of the characters "asdfghjkl", and
// the third row consists of the characters "zxcvbnm".

// CODE

var findWords = function(words) {
    const keyBoardRows = [
        new Set("qwertyuiop"),
        new Set("asdfghjkl"),
        new Set("zxcvbnm")
    ]

    return words.filter(word => {
        const lowerCaseWord = word.toLowerCase();
        const row = keyBoardRows.find(set => set.has(lowerCaseWord[0]));

        //Check if all characters in the word are in the same row
        return [...lowerCaseWord].every(char => row.has(char))
    })
};

const words = ["Hello","Alaska","Dad","Peace"];
const findingWordsOutput = findWords(words);
console.log("finding Words Output : " , findingWordsOutput);

// Relative Rank

// You are given an integer array score of size n, where score[i] is the score of the ith athlete in a competition. All the scores are guaranteed to be unique.

// The athletes are placed based on their scores, where the 1st place athlete has the highest score, the 2nd place athlete has the 2nd highest score, and so on. The placement of each athlete determines their rank:

// The 1st place athlete's rank is "Gold Medal".
// The 2nd place athlete's rank is "Silver Medal".
// The 3rd place athlete's rank is "Bronze Medal".
// For the 4th place to the nth place athlete, their rank is their placement number (i.e., the xth place athlete's rank is "x").
// Return an array answer of size n where answer[i] is the rank of the ith athlete.

// Example 1:
// Input: score = [5,4,3,2,1]
// Output: ["Gold Medal","Silver Medal","Bronze Medal","4","5"]
// Explanation: The placements are [1st, 2nd, 3rd, 4th, 5th].

// Example 2:
// Input: score = [10,3,8,9,4]
// Output: ["Gold Medal","5","Bronze Medal","Silver Medal","4"]
// Explanation: The placements are [1st, 5th, 3rd, 2nd, 4th].

// CODE


var findRelativeRanks = function(score) {
    const sortedScores = [...score].sort((a, b) => b - a);
   const rankMap = new Map();

   for (let i = 0; i < sortedScores.length; i++) {
       const athleteScore = sortedScores[i];
       if (i === 0) {
           rankMap.set(athleteScore, "Gold Medal");
       } else if (i === 1) {
           rankMap.set(athleteScore, "Silver Medal");
       } else if (i === 2) {
           rankMap.set(athleteScore, "Bronze Medal");
       } else {
           rankMap.set(athleteScore, (i + 1).toString());
       }
   }

   return score.map(athleteScore => rankMap.get(athleteScore));
};

const score = [10,3,8,9,4];
const findRelativeRanksOutput = findRelativeRanks(score);
console.log("find Relative Ranks Output : ",findRelativeRanksOutput );