CollabForm.Model = function () {
}

CollabForm.Model.prototype.getVotes = function (questionIds, callback) {
    Service.invoke("/getVotes.json", { questionIds: questionIds }, callback);
}

CollabForm.Model.prototype.vote = function (questionId, resultText, callback) {
    Service.invoke("/vote.json", { questionId: questionId, resultText: resultText }, callback);
}

CollabForm.Model.prototype.unlock = function (questionId, callback) {
    Service.invoke("/unlock.json", { questionId: questionId }, callback);
}

CollabForm.Model.prototype.lock = function (questionId, callback) {
    Service.invoke("/lock.json", { questionId: questionId }, callback);
}
