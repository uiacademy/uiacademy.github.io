## Running studapp in Vagrant

Start vagrant box and studapp

```shell
$ vagrant up
$ vagrant ssh
$ cd /vagrant/studapp/bin && ./run.sh start
```

Make changes locally

    studapp/web/testodata.html

Test in browser

    http://192.168.56.101:8980/testodata.html