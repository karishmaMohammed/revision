// Single number

// Given a non-empty array of integers nums, every element appears twice except for one. 
// Find that single one.
// You must implement a solution with a linear runtime complexity 
// and use only constant extra space.

// Example 1:
// Input: nums = [2,2,1]
// Output: 1

// Example 2:
// Input: nums = [4,1,2,1,2]
// Output: 4

// Example 3:
// Input: nums = [1]
// Output: 1

//APPROACH
// doing XOR OPERATION same elements gives result 0 else 1

var singleNumber = function(nums){
    let result =0;
    for(let num of nums){
        result ^= num
    }
    return result;
}

const nums = [2, 2, 4, 3, 3]
const singleNumberOutput = singleNumber(nums);
console.log("single number output :", singleNumberOutput);

// Contains Duplicates 2

// Given an integer array nums and an integer k, return true if there are 
// two distinct indices i and j in the array such that 
// nums[i] == nums[j] and abs(i - j) <= k.

// Example 1:
// Input: nums = [1,2,3,1], k = 3
// Output: true

// Example 2:
// Input: nums = [1,0,1,1], k = 1
// Output: true

// Example 3:
// Input: nums = [1,2,3,1,2,3], k = 2
// Output: false

//Approach
// taken map to keep track of value and indexes checking the condition nums[i] == nums[j] and abs(i - j) <= k.

//Code

var containDuplicates = function(nums, k){
    let IndexMap = new Map();
    for(let i=0; i<nums.length; i++){
        let num = nums[i];
        if(IndexMap.has(num) && i - IndexMap.get(num) <= k)
        return true;
    IndexMap.set(num, i);
    }
    return false;
}

const DuplNums = [1,2,3,1,2,3], k = 2
const duplicateOutput = containDuplicates(DuplNums, k);
console.log("Duplicate : ", duplicateOutput);