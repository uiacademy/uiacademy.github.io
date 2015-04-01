Vagrant.configure("2") do |config|

	config.vm.box = "precise64.box"
	config.vm.box_url = "http://files.vagrantup.com/precise64.box"
	config.vm.network "private_network", ip: "192.168.56.101"
	config.vm.hostname = "ui-academy"

	config.vm.usable_port_range = (2200..2250)

	config.vm.provider :virtualbox do |virtualbox|
		virtualbox.customize ["modifyvm", :id, "--name", "ui-academy"]
		virtualbox.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
		virtualbox.customize ["modifyvm", :id, "--memory", 2048]
		virtualbox.customize ["modifyvm", :id, "--ioapic", "on"]
	end

	config.vm.provision :puppet do |puppet|
		puppet.manifests_path = '.vagrant/puppet/manifests'
		puppet.module_path = '.vagrant/puppet/modules'
	end
end


