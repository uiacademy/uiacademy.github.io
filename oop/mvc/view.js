CollabForm.View = function (config, canvas) {
    this.config = config;
    this.canvas = canvas;
};

CollabForm.View.prototype.addListener = function (listener) {
    this.listener = listener;
}

CollabForm.View.prototype.render = function () {
    this.hideTemplates();
    this.bindGlobalActions();
    this.renderTitle();
    this.renderFields();
    this.bindFieldActions();
}

CollabForm.View.prototype.hideTemplates = function () {
    $(".template", this.canvas).hide();
}

CollabForm.View.prototype.bindGlobalActions = function () {
    $("#refreshAction").click($.proxy(function () {
        this.listener.refresh();
    }, this));
}

CollabForm.View.prototype.renderTitle = function () {
    $("#title", this.canvas).text(this.config.title);
}

CollabForm.View.prototype.renderFields = function () {
    var fieldConfigs = this.config.fields;
    var fieldTable = $("#fieldTable", this.canvas);
    for (var i = 0; i < fieldConfigs.length; ++i) {
        var fieldConfig = fieldConfigs[i];
        var field = $("#fieldTemplate", this.canvas).clone();
        field.attr("id", "f" + i);
        field.removeClass("template");
        field.addClass("field");
        $(".fieldLabel", field).text(fieldConfig.label);
        $(".fieldInput > input", field).val(fieldConfig.value);
        fieldTable.append(field);
        field.show();
        var message = CollabForm.renderMessage(this.config, fieldConfig.unlockedBy);
        if (fieldConfig.unlockedByMe) {
            this.unlock(i, message);
        } else {
            this.lock(i, message);
        }
    }
}

CollabForm.View.prototype.bindFieldActions = function () {
    var fieldConfigs = this.config.fields;
    var fieldTable = $("#fieldTable", this.canvas);
    var view = this;
    for (var i = 0; i < fieldConfigs.length; ++i) {
        var fieldConfig = fieldConfigs[i];
        var field = $(".field", fieldTable)[i];
        $(".editAction", field).click(function () {
            var index = view.getIndex(this);
            view.listener.unlock(index);
        });
        $(".saveAction", field).click(function () {
            var index = view.getIndex(this);
            var value = view.getInputValue(this);
            view.listener.save(index, value);
        });
        $(".cancelAction", field).click(function () {
            var index = view.getIndex(this);
            view.listener.cancel(index);
        });
    }
}

CollabForm.View.prototype.lock = function (index, message) {
    var field = $("#f" + index, this.canvas);
    field.removeClass("unlocked");
    field.addClass("locked");
    $("input", field).attr("readonly", "readonly");
    $("input", field).val(this.config.fields[index].value);
    $(".editAction", field).show();
    $(".saveAction", field).hide();
    $(".cancelAction", field).hide();
    $(".fieldMessage", field).text(message);
}

CollabForm.View.prototype.unlock = function (index, message) {
    var field = $("#f" + index, this.canvas);
    field.removeClass("locked");
    field.addClass("unlocked");
    $("input", field).removeAttr("readonly");
    $(".editAction", field).hide();
    $(".saveAction", field).show().css("display", "inline");
    $(".cancelAction", field).show();
    $(".fieldMessage", field).text(message);
}

CollabForm.View.prototype.populateFields = function () {
    var fieldConfigs = this.config.fields;
    var fieldTable = $("#fieldTable", this.canvas);
    for (var i = 0; i < fieldConfigs.length; ++i) {
        var fieldConfig = fieldConfigs[i];
        var field = $(".field", fieldTable)[i];
        if ($(field).hasClass("locked")) {
            $(".fieldInput > input", field).val(fieldConfig.value);
        }
        var message = CollabForm.renderMessage(this.config, fieldConfig.unlockedBy);
        $(".fieldMessage", field).text(message);
    }
}

CollabForm.View.prototype.showError = function (message) {
    alert(message); // ToDo: consider improving the user experience of this...
}

CollabForm.renderMessage = function (config, unlockedBy) {
    var message = "";
    if (unlockedBy != "") {
        message = config.unlockMessage.replace("{0}", unlockedBy);
    }
    return message;
}

CollabForm.View.prototype.getInputValue = function (source) {
    var field = this.getField(source);
    var value = $("input", field).val();
    return value;
}

CollabForm.View.prototype.getIndex = function (source) {
    var field = this.getField(source);
    var index = parseInt(field.id.substr(1));
    return index;
}

CollabForm.View.prototype.getField = function (source) {
    return $(source).parents("tr")[0];
}
