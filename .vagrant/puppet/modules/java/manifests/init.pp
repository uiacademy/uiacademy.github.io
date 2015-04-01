class java {

  exec { "update apt":
    command => "sudo apt-get update",
    path    => ["/bin", "/usr/bin"],
  }

  exec { "install python software":
    command => "sudo apt-get install -f -y python-software-properties",
    path    => ["/bin", "/usr/bin"],
  }

  exec { "add java 8 repo":
    command => "sudo add-apt-repository ppa:webupd8team/java",
    path    => ["/bin", "/usr/bin"],
    require  => Exec["install python software"],
  }

  exec { "update apt 2":
    command => "sudo apt-get update",
    path    => ["/bin", "/usr/bin"],
    require  => Exec["add java 8 repo"],
  }

  exec { "install java":
    command => "echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | sudo /usr/bin/debconf-set-selections | sudo apt-get install -y -f oracle-java8-installer",
    path    => ["/bin", "/usr/bin"],
    require => Exec["update apt 2"]
  }

}