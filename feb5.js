// CONTAIN DUPLICATE
// Given an integer array nums, return true if any value 
// appears at least twice in the array, and return false 
// if every element is distinct.

// Example 1:
// Input: nums = [1,2,3,1]
// Output: true

// Example 2:
// Input: nums = [1,2,3,4]
// Output: false

// APPROACH
// WE iterate through array and add them in map if that element already present in map
// then it state that array contains duplicates

// CODE

var duplicateContains = function(nums){
    const map = new Map()
    for(const n of nums){
        if(map.has(n)) return true // map already contain that element then return true
        map.set(n, true)
    }
    return false; // no duplicates found
}

const nums = [1, 2, 3, 1];
const duplicateOutput = duplicateContains(nums);
console.log("Duplicate Conatins: ", duplicateOutput);


// VALID ANAGRAM

// Given two strings s and t, return true if t is an anagram of s, and false otherwise.

// An Anagram is a word or phrase formed by rearranging the 
// letters of a different word or phrase, typically using all the original letters 
// exactly once.

// Example 1:
// Input: s = "anagram", t = "nagaram"
// Output: true

// Example 2:
// Input: s = "rat", t = "car"
// Output: false

// APPROACH
// iterate through s and add into map for every character count increase by 1
// now iterate through t decrement count by 1 if that character is present in map

// CODE

var anagram = function(s, t){
    if(s.length !== t.length) return false
    const map = new Map()
    for(const char of s){
        if(map.has(char)) map.set(char, map.get(char)+1)
        else
        map.set(char, 1)
    }
    for(const char of t){
        if(!map.has(char)) return false
        map.set(char, map.get(char) -1)
        if(map.get(char) === 0) map.delete(char)
    }
    if(map.size > 0) return false

    return true
}

const s = "karishma";
const t = "shmairak";
const anagramOutput = anagram(s,t)
console.log("anagram output :" ,anagramOutput)