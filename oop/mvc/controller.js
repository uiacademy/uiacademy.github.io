CollabForm.Controller = function (config, view, model) {
    this.config = config;
    this.view = view;
    this.model = model;
}

CollabForm.Controller.prototype.refresh = function () {
    var questionIds = [];
    var fieldConfigs = this.config.fields;
    for (var i = 0; i < fieldConfigs.length; ++i) {
        var fieldConfig = fieldConfigs[i];
        questionIds.push(fieldConfig.questionId);
    }
    this.model.getVotes(questionIds, $.proxy(function (votes) {
        var fieldConfigs = this.config.fields;
        for (var i = 0; i < votes.length; ++i) {
            var vote = votes[i];
            for (var j = 0; j < fieldConfigs.length; ++j) {
                var fieldConfig = fieldConfigs[j];
                if (fieldConfig.questionId == vote.questionId) {
                    fieldConfig.value = vote.value;
                    fieldConfig.unlockedBy = vote.unlockedBy;
                }
            }
        }
        this.view.populateFields();
    }, this));
}

CollabForm.Controller.prototype.save = function (index, value) {
    var fieldConfig = this.config.fields[index];
    var questionId = fieldConfig.questionId;
    this.model.vote(questionId, value, $.proxy(function () {
        fieldConfig.value = value;
        this.model.lock(questionId, $.proxy(function () {
            this.view.lock(index, "");
        }, this));
    }, this));
}

CollabForm.Controller.prototype.unlock = function (index) {
    var questionId = this.config.fields[index].questionId;
    this.model.unlock(questionId, $.proxy(function (result) {
        var message = CollabForm.renderMessage(this.config, result.unlockedByParticipantName);
        if (result.success) {
            this.view.unlock(index, message);
        } else {
            this.view.showError(message);
        }
    }, this));
};

CollabForm.Controller.prototype.cancel = function (index) {
    var questionId = this.config.fields[index].questionId;
    this.model.lock(questionId, $.proxy(function () {
        this.view.lock(index, "");
    }, this));
}

CollabForm.Controller.prototype.autoRefresh = function () {
    window.setTimeout($.proxy(function () {
        this.refresh();
        this.autoRefresh();
    }, this), 5000);
}

