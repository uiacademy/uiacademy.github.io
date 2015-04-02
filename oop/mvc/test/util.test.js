module("util");

test("isNumeric", function () {
    ok(isNumeric("123"), "digits");
    ok(!isNumeric("abc"), "letters");
    ok(!isNumeric(""), "empty string");
    raises(function () { !isNumeric(null); }, "should throw on null");
});
