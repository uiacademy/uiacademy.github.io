require(['Models/User', 'Router'], function (User, Router) {
    var users = [
        new User('Barney'),
        new User('Cartman'),
        new User('Sheldon')
    ];

    localStorage.users = JSON.stringify(users);

    Router.startRouting();
});
