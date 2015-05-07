function Note(url, title, description) {
    this.id = this.generateUUID();
    this.url = url;
    this.title = title;
    this.description = description;
}
Note.prototype = {
    constructor: Note,
    generateUUID: function () {
        /*jslint bitwise: true */
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },

    validate: function () {
        if (this.title === "") {
            throw Error("Title can't be null");
        }
        var isEmpty = this.title.replace(new RegExp("[a-z]", "gi"), "");
        if (isEmpty !== "") {
            throw Error("Invalid char use only [a-z]");
        }
    }
};

function Model() {
    this.notes = {};
}

Model.prototype = {
    constructor: Model,

    notes: {},

    create: function (url, title, desctiption) {
        var note = new Note(url, title, desctiption);
        note.validate();
        this.notes[note.id] = note;
        this.save();
    },

    update: function (note) {
        this.notes[note.id] = note;
        this.save();
    },

    remove: function (id) {
        delete this.notes[id];
        this.save();
    },

    read: function () {
        var items = JSON.parse(window.localStorage.getItem("notes"));
        this.notes = {};
        for (var i in items) {
            var item = items[i];
            var note = new Note(item.url, item.title, item.description);
            note.id = item.id;

            this.notes[note.id] = note;
        }

        return this.notes;
    },

    getNoteId: function (id) {
        return this.notes[id];
    },

    save: function () {
        window.localStorage.setItem("notes", JSON.stringify(this.notes));
    }
};

function View(forma) {
    this.form = forma;
    this.binds();
}

View.prototype = {
    constructor: View,

    binds: function () {
        $(this.form).submit(function (e) {
            e.preventDefault();

            $(document).trigger("notes.create", {
                title: $(this).find(".input-title").val(),
                url: $(this).find(".input-url").val(),
                description: $(this).find(".textarea-description").val()
            });

            return false;
        });
    },

    displayItems: function (items) {
        var template = $("#template").html();
        $("#sarasasKairej").html("");

        for (var x in items) {
            var dom = doT.template(template)(items[x]);
            $("#sarasasKairej").append(dom);
        }

        this.bindsLeftItems();
    },

    bindsLeftItems: function () {
        $("#sarasasKairej .item").on("click", function () {
            $(document).trigger("note.print", $(this).data("id"));
        });
    },

    printItem: function (note) {
        var template = $("#mediaTemplate").html();
        var dot = doT.template(template);
        $(".desine75").html(dot(note));
        this.bindContent();
    },

    emptyItemBlock: function () {
        $(".desine75").html("");
    },

    bindContent: function () {
        $(".desine75 .actions .delete").on("click", function (e) {
            e.preventDefault();
            $(document).trigger("note.delete", $(this).parent().data("id"));
        });
    },


};


function Controller(model, view) {
    this.model = model;
    this.view = view;
    this.init();
}

Controller.prototype = {
    constructor: Controller,

    model: null,
    view: null,

    init: function () {
        var model = this.model,
            view = this.view;

        $(document).bind("notes.create", function (e, note) {
            try {
                model.create(note.url, note.title, note.description);
            } catch(e) {
                alert (e);
            }

            view.displayItems(model.read());
        });

        $(document).bind("note.print", function (e, id) {
            var note = model.getNoteId(id);
            view.printItem(note);
        });

        $(document).bind("note.delete", function (e, id) {
            model.remove(id);
            view.emptyItemBlock();
            view.displayItems(model.read());
        });
    },

    start: function () {
        this.view.displayItems(this.model.read());
    }
};


var controller = new Controller(new Model(), new View($("#forma")));
controller.start();
