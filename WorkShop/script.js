function Note(url, title, description) {
	this.id = this.generateUUID();
	this.url = url;
	this.title = title;
	this.description = description;
}
Note.prototype.generateUUID = function () {
	/*jslint bitwise: true */
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
};

function Model() {
	this.notes = {};
	this.notesArray = [];
}

Model.prototype.create = function (url, title, desctiption) {
	var note = new Note(url, title, desctiption);
	this.notes[note.id] = note;
	this.notesArray.push(note);
};

Model.prototype.update = function (note) {
	this.notes[note.id] = note;
};
Model.prototype.delete = function (id) {
	delete this.notes[id];
};
Model.prototype.read = function () {
	return this.notes;
};
Model.prototype.readArray = function () {
	return this.notesArray;
};

Model.prototype.getNoteId = function (id) {
	return this.notes[id];
};


function Controller(model, view) {
	$(document).bind("notes.create", function (e, note) {
		model.create(note.url, note.title, note.description);
		view.displayItems(model.read());
	});

	$(document).bind("note.print", function (e, id) {
		var note = model.getNoteId(id);
		view.printItem(note);
	});
}

Controller.prototype.start = function () {

};


function View(forma) {
	this.form = forma;
	this.binds();
}

View.prototype.displayItems = function (items) {
	var template = $("#template").html();

	$("#sarasasKairej").html("");

	for(var x in items) {
		var dom = doT.template(template)(items[x]);
		$("#sarasasKairej").append(dom);
	}

	this.bindsLeftItems();
};

View.prototype.bindsLeftItems = function () {
	var self = this;
	$("#sarasasKairej .item").on("click", function () {
		$(document).trigger("note.print", $(this).data("id"));
	});
};

View.prototype.printItem = function (note) {
	var template = $("#mediaTemplate").html();
	var dot = doT.template(template);
	$(".desine75").html(dot(note));
};


View.prototype.binds = function () {
	$(this.form).submit(function (e) {
		e.preventDefault();
		var title = $(this).find(".input-title").val();
		var url = $(this).find(".input-url").val();
		var description = $(this).find(".textarea-description").val();
		console.log({
			title:title,
			url:url,
			description:description
		});
		$(document).trigger("notes.create", {
			title: title,
			url: url,
			description:description
		});
		return false;
	});
};


var controller = new Controller(new Model(), new View($("#forma")));
controller.start();


//$('#forma').submit(function(e){
//	e.preventDefault();
//	var newNote = {title : $('#formtitle').val(), photo : $('#formbody').val(), content : $('#formurl').val()};
// 	notes.push(newNote);
//  	populatedSimpleArrayTemplate = ;
//	$("#sarasasKairej").html(populatedSimpleArrayTemplate);
//	clickWrapper();
//
//});

