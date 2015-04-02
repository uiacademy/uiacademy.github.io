var html;
$.ajax('../collabForm.html', {
    async: false,
    complete: function (xhr) {
        html = xhr.responseText;
    }
});
module("view", {
    setup: function () {
        this.canvas = $($(html.substr(html.indexOf('<div id="collabForm">')))[0]);
        this.config = { title: "Discuss", unlockMessage: "Edited by {0}", fields: [{ label: "Idea", value: "Play", unlockedByMe: true, unlockedBy: "Lars" }, { label: "Advice", value: "Think", unlockedByMe: false, unlockedBy: "Kurt"}] };
        this.view = new CollabForm.View(this.config, this.canvas);
        this.view.hideTemplates();
    }
});
test("hideTemplates", function () {
    var fields = $("#fieldTable > tbody > tr:visible", this.canvas);
    equal(fields.length, 0);
});
test("renderTitle", function () {
    this.view.renderTitle();
    equal($("#title", this.canvas).text(), "Discuss");
});
test("renderFields", function () {
    this.view.renderFields();
    var fields = $("#fieldTable .field", this.canvas);
    equal(fields.length, 2);
    equal($("#f0 .fieldLabel", this.canvas).text(), "Idea");
    ok($("#f0", this.canvas).hasClass("unlocked"));
    equal($("#f1 .fieldLabel", this.canvas).text(), "Advice");
    ok($("#f1", this.canvas).hasClass("locked"));
});
test("populateFields", function () {
    this.view.renderFields();
    this.view.populateFields();
    equal($("#f0 input", this.canvas).val(), "Play");
    equal($("#f1 input", this.canvas).val(), "Think");
    equal($("#f1 .fieldMessage", this.canvas).text(), "Edited by Kurt");
});
test("unlock", function () {
    this.view.renderFields();
    this.view.unlock(1, "Edited by me");
    var f1 = $("#f1", this.canvas);
    ok(f1.hasClass("unlocked"));
    ok(!f1.hasClass("locked"));
    equal($(".fieldMessage", f1).text(), "Edited by me");
    equal($(".saveAction", f1).css("display"), "inline");
    ok(!$("input", f1).attr("readonly"));
});
test("lock", function () {
    // setup
    this.view.renderFields();
    this.view.unlock(1, "Edited by me");
    $("#f1 input", this.canvas).val("xpqf");

    // invoke
    this.view.lock(1, "");

    // verify
    var f1 = $("#f1", this.canvas);
    ok(f1.hasClass("locked"));
    ok(!f1.hasClass("unlocked"));
    equal($("input", f1).val(), "Think"); // Note: text box content is changed back to original
    equal($(".fieldMessage", f1).text(), "");
    equal($(".saveAction", f1).css("display"), "none");
    ok($("input", f1).attr("readonly"));
});
test("saveAction", function () {
    // setup
    this.view.renderFields();
    var controllerStub = { index: -1, value: "", save: function (index, value) { this.index = index, this.value = value } };
    this.view.addListener(controllerStub);

    // invoke
    this.view.bindFieldActions();
    var input = $("#f1 input", this.canvas);
    input.val("xpqf");
    equal(input.val(), "xpqf");
    var button = $("#f1 .saveAction", this.canvas);
    button.click();

    // verify
    equal(controllerStub.index, 1);
    equal(controllerStub.value, "xpqf");
});

