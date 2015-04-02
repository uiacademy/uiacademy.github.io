var CollabForm = {};

CollabForm.bootstrap = function (config) {
    CollabForm.view = new CollabForm.View(config, $("#collabForm"));
    CollabForm.model = new CollabForm.Model();
    CollabForm.controller = new CollabForm.Controller(config, CollabForm.view, CollabForm.model);
    CollabForm.view.addListener(CollabForm.controller);
    CollabForm.view.render();
    CollabForm.controller.autoRefresh();
};

