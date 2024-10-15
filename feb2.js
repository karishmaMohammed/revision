// TWO SUM
// Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

// You may assume that each input would have exactly one solution, and you may not use the same element twice.

// You can return the answer in any order.

// Example 1:

// Input: nums = [2,7,11,15], target = 9
// Output: [0,1]
// Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

// Example 2:

// Input: nums = [3,2,4], target = 6
// Output: [1,2]

// APPROACH
// TAKING MAP ITERATING THROUGH ARRAY IF NO SUCH ELEMENT FOUND IN MAP THEN PLACING
// IT IN MAP AS KEY(ELEMENT) AND VALUE(INDEX) simultaniosly checking the logic
// logic = target - value result value present in map then iteration stops we got the pair
// that sums to target value

// CODE

var twoSum = function(nums, target){
    const map = new Map();
    for(const index in nums){
        const pairValue = target - nums[index];
        console.log(pairValue);
        if(map.has(pairValue)) return [map.get(pairValue), index];
        map.set(nums[index], index)
    }
}
const nums = [2, 7, 11, 15];
const target = 9
const output = twoSum(nums, target);
console.log("Output of two sum :", output);


// THREE SUM 
