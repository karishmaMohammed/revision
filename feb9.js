// REMOVE ELEMENT

// Given an integer array nums and an integer val, 
// remove all occurrences of val in nums in-place. 
// The order of the elements may be changed. Then return the number of 
// elements in nums which are not equal to val.

// Consider the number of elements in nums which are not equal to val be k,
//  to get accepted, you need to do the following things:

// Change the array nums such that the first k elements of nums 
// contain the elements which are not equal to val. 
// The remaining elements of nums are not important as well as the size of nums.
// Return k.

//CODE

var removeElement = function(nums, val) {
    let k = 0; // just to keep track the count
    for (let i = 0; i < nums.length; i++) { // iterating through the array
        if (nums[i] !== val) { // checking array element with value if not equal
            nums[k] = nums[i]; // return k else increment the k value
            k++;
        }
    }
    return k;
};
 
const nums = [3, 2, 2, 3]
const val = 3
const RemoveElementOutput = removeElement(nums, val);
console.log(RemoveElementOutput);
// nums.slice(startingIndex, (lastIndex-1))
console.log("Remove Element Output :", nums.slice(0, RemoveElementOutput));


// ARRAY PARTITION

// Given an integer array nums of 2n integers, group these integers into 
// n pairs (a1, b1), (a2, b2), ..., (an, bn) such that the sum of min(ai, bi) 
// for all i is maximized. Return the maximized sum.

// APPROACH
// first sort the given integer array then iterate through array with pair increment of +2
// add it to the sum variable

// CODE

var arrayPairSum = function(nums) {
    nums.sort((a, b) => a - b);
    let sum = 0;
    for(let i=0; i<nums.length-1; i+=2){
        sum += Math.min(nums[i], nums[i+1])
    }
    return sum;
};

const numsarray = [6,2,6,5,1,2];
const pairArraySumOutput = arrayPairSum(numsarray);
console.log("pair Array Sum Output :", pairArraySumOutput);