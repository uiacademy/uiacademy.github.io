module("svc");

test("hello", function () {
    stop(); // stop(1000); // for debugging
    expect(2);
    Service.invoke("/hello.json", null, function (result) {
        ok(result.success, result.message);
        equal(result.message, "hello");
        start();
    });
});
