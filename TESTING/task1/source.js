/*
    sumIf - sums all elements of an array using a custom filtering function
    
    
    Array array - an array of elements
    Function filter - an array 

*/
function sumIf(array, filter) {
    
    if(arguments.length == 0 || arguments.length > 2) {
        throw new Error("Unexpected number of arguments");
    }
 
    if(!(array instanceof Array)) {
        throw new Error("First argument has to be an array");
    }
    
    filter = filter == null ? function(a) { return a; } : filter;
    
    var sum = 0;
    array.forEach(function(a){
        sum += filter(a);
    });
    
    return sum;
}



