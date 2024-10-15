// MAXIMUM PRODUCT SUBARRAY

// Given an integer array nums, find a
// subarray
//  that has the largest product, and return the product.

// The test cases are generated so that the answer will fit in a 32-bit integer.

// Example 1:
// Input: nums = [2,3,-2,4]
// Output: 6
// Explanation: [2,3] has the largest product 6.

// Example 2:
// Input: nums = [-2,0,-1]
// Output: 0
// Explanation: The result cannot be 2, because [-2,-1] is not a subarray.

// APPROACH
//considering 3 variables assign to first element in array
//maxproduct, currentMax, currentMin to nums[0];
//iterate through the array if encounter a negative number then interchange the values
// of currentMax and currentMin

// CODE

var maxProductSubArray = function (nums) {
  if (nums.length === 0) return 0;
  let maxProduct = nums[0];
  let currentMax = nums[0];
  let currentMin = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < 0) [currentMax, currentMin] = [currentMin, currentMax];
    currentMax = Math.max(nums[i], currentMax * nums[i]);
    currentMin = Math.min(nums[i], currentMin * nums[i]);
    maxProduct = Math.max(maxProduct, currentMax);
  }
  return maxProduct;
};


const nums = [2, 3, -2, 4];
const output = maxProductSubArray(nums);
console.log("maximum product subArray: " ,output);

// MAXIMUM SUBARRAY

// Given an integer array nums, find the 
// subarray
//  with the largest sum, and return its sum.

// Example 1:
// Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
// Output: 6
// Explanation: The subarray [4,-1,2,1] has the largest sum 6.

// Example 2:
// Input: nums = [1]
// Output: 1
// Explanation: The subarray [1] has the largest sum 1.

// APPROACH
// iterate through array, taking 2 variables maxvalue and sumvalue,
// checking condition if maxvalue less than sumvalue then update maxvalue by sumvalue
// other condition if sumvalue less than zero then update sumvalue with 0 result of summation

// code

var maxSubArray = function(nums){
    let max = nums[0];
    let sum = 0;
    nums.forEach((n) => {
        sum += n;
        max = Math.max(max, sum)
        if(sum < 0) sum = 0;
    })
    return max;
}

const array = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
const maximumSubArray = maxSubArray(array);
console.log("maximum subarray: ", maximumSubArray);