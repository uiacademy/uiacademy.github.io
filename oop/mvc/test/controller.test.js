module("controller", {
    setup: function () {
    }
});
test("refresh", function () {
    // setup
    var modelStub = {
        getVotes: function (questionIds, callback) {
            callback([{ questionId: 17, value: "42", unlockedBy: "Kurt"}]);
        }
    }
    var viewStub = { populateFieldsInvoked: false, populateFields: function () { this.populateFieldsInvoked = true; } };
    var config = { unlockMessage: "Edited by {0}", fields: [{ questionId: 17}] };
    var controller = new CollabForm.Controller(config, viewStub, modelStub);

    // invoke
    controller.refresh();

    // verify
    ok(viewStub.populateFieldsInvoked);
    var f0 = config.fields[0];
    equal(f0.value, "42");
    equal(f0.unlockedBy, "Kurt");
});
test("save", function () {
    // setup
    var modelStub = {
        questionId: -1,
        value: "",
        vote: function (questionId, value, callback) {
            this.questionId = questionId;
            this.value = value;
            callback();
        },
        lock: function (questionId, callback) {
            callback();
        }
    };
    var viewStub = {
        lockIndex: -1,
        lock: function (index) {
            this.lockIndex = index;
        }
    };
    var config = { foremanId: 12, fields: [{ questionId: 17}] };
    var controller = new CollabForm.Controller(config, viewStub, modelStub);

    // invoke
    controller.save(0, "hey");

    // verify
    equal(config.fields[0].value, "hey");
    equal(modelStub.questionId, 17);
    equal(modelStub.value, "hey");
    equal(viewStub.lockIndex, 0);
});
test("unlock", function () {
    // setup
    var modelStub = {
        unlock: function (questionId, callback) {
            callback({ success: true, unlockedByParticipantName: "Lars" });
        }
    };
    var viewStub = {
        unlock: function (index, message) {
            this.unlockIndex = index;
            this.message = message;
        }
    };
    var config = { foremanId: 12, unlockMessage: "Edited by {0}", fields: [{ questionId: 17}] };
    var controller = new CollabForm.Controller(config, viewStub, modelStub);

    // invoke
    controller.unlock(0);

    // verify
    equal(viewStub.unlockIndex, 0);
    equal(viewStub.message, "Edited by Lars");
});
test("unlock_fails", function () {
    // setup
    var modelStub = {
        unlock: function (questionId, callback) {
            callback({ success: false, unlockedByParticipantName: "Kurt" });
        }
    };
    var viewStub = {
        showError: function (message) {
            this.message = message;
        }
    };
    var config = { foremanId: 12, unlockMessage: "Already locked by {0}", fields: [{ questionId: 17}] };
    var controller = new CollabForm.Controller(config, viewStub, modelStub);

    // invoke
    controller.unlock(0);

    // verify
    equal(viewStub.message, "Already locked by Kurt");
});
test("cancel", function () {
    // setup
    var modelStub = {
        vote: function (questionId, value, callback) {
            ok(false);
        },
        lock: function (questionId, callback) {
            callback();
        }
    };
    var viewStub = {
        lockIndex: -1,
        lock: function (index) {
            this.lockIndex = index;
        }
    };
    var config = { foremanId: 12, fields: [{ questionId: 17}] };
    var controller = new CollabForm.Controller(config, viewStub, modelStub);

    // invoke
    controller.cancel(0);

    // verify
    equal(viewStub.lockIndex, 0);
});
