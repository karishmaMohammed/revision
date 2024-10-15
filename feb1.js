// PROBLEM STATEMENT

// SEARCH IN ROTATED SORTED ARRAY

// There is an integer array nums sorted in ascending order (with distinct values).

// Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed). For example, [0,1,2,4,5,6,7] might be rotated at pivot index 3 and become [4,5,6,7,0,1,2].

// Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.

// You must write an algorithm with O(log n) runtime complexity.

// EXPECTED OUTPUTS
// Example 1:
// Input: nums = [4,5,6,7,0,1,2], target = 0
// Output: 4

// Example 2:
// Input: nums = [4,5,6,7,0,1,2], target = 3
// Output: -1

// Example 3:
// Input: nums = [1], target = 0
// Output: -1

var search = function (nums, target) {
    // solving through binary search
    let first = 0, last = nums.length - 1;
    while (first <= last) {
        //inside while loop till first is less than last
        const center = Math.floor((first + last) / 2);
        // target is center element then return center
        if (nums[center] === target) return center;
        // if first half elements are in sorted order
        if (nums[center] >= nums[first]) {
            // if target is present in first half of the sorted elements
            if (target >= nums[first] && target < nums[center])
                last = center - 1;
            else
                first = center + 1;

        }
        // if target is present in second half of the given array
        else {
            if (target > nums[center] && target <= nums[last])
                first = center + 1;
            else
                last = center - 1;
        }

    }
    return -1;
};

const nums = [4,5,6,7,0,1,2], target = 6
const output = search(nums, target);
console.log(output);

// PRODUCT OF ARRAY EXCEPT SELF

// PROBLEM STATEMENT
// Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].
// The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.
// You must write an algorithm that runs in O(n) time and without using the division operation.

// Example 1:
// Input: nums = [1,2,3,4]
// Output: [24,12,8,6]

// Example 2:
// Input: nums = [-1,1,0,-3,3]
// Output: [0,0,9,0,0]

var productExceptSelf = function(nums){
    // result array
    let resultArray = []; 
    let helper = 1;
    for(let i=0; i<nums.length; i++){
        // nums = [1, 2, 3, 4]
        // resultArray = [1, 1(1*1), 2(2*1), 6(2*3)] = [1, 1, 2, 6]
        resultArray.push(helper);
        helper = helper * nums[i];
    }
    let secondHelper = 1;
    // loop runs from last 
    // nums = [4, 3, 2, 1]
    // resultArray = [1, 1, 2, 6] => reverse = [6, 2, 1, 1]
    for(let i=nums.length -1; i>=0; i--){
        // 
        resultArray[i] = secondHelper * resultArray[i];
        secondHelper = secondHelper * nums[i];
    }
    // time complexity O(n + n) = O(2n) = O(n)
    return resultArray;
}
const array = [1, 2, 3, 4];
const desiredOutput = productExceptSelf(array);
console.log("productExceptSelf :",desiredOutput);