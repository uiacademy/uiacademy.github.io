Service = {}

Service.invoke = function (url, args, callback) {
    $.ajax({
        type: "POST",
        url: "svc" + url,
        data: args,
        traditional: true, // to be compatible with ASP.NET service
        async: true,
        dataType: "json",
        success: function (result) {
            callback(result);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            var result = { success: false, message: "ajax call failed: " + XMLHttpRequest.responseText + " - " + textStatus + " - " + errorThrown };
            callback(result);
        }
    });
}
