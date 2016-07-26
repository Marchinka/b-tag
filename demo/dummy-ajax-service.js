var superheroList = [
	{ key: 1, value: "Superman"},
	{ key: 2, value: "Batman"},
	{ key: 3, value: "Green Lantern"},
	{ key: 4, value: "Aquaman"},
	{ key: 5, value: "Captain America"},
	{ key: 6, value: "Captain Britain"},
	{ key: 7, value: "Deadpool"},
	{ key: 8, value: "Thor"},
	{ key: 9, value: "Bat-mito"},
	{ key: 10, value: "Spiderman"},
	{ key: 11, value: "Hulk"},
	{ key: 12, value: "Red Hulk"},
	{ key: 13, value: "The Incredible Nightcrawler"},
	{ key: 14, value: "Dr. X."},
	{ key: 15, value: "Rocket Racoon"}
];

var superVillans = [
	{ name: "Tweedledum and Tweedledee" },
	{ name: "Joker" },
	{ name: "Bane" },
	{ name: "Killer Croc" },
	{ name: "The Riddler" },
	{ name: "Dr. Strange" },
	{ name: "Penguin" },
	{ name: "Two Faces" },
	{ name: "Mr Freeze" },
	{ name: "Harley Queen" },
	{ name: "Deadshot" },
	{ name: "Solomon Grundy" },
	{ name: "Deathstroke" },
	{ name: "Manbat" },
	{ name: "Poison Ivy" },
	{ name: "Scarecrow" },
	{ name: "Black Mask" },	
];

var ValidationError = function (field, message) {
	this.field = field;
	this.message = message;
};

var ValidationFeedback = function (field, message) {
	this.field = field;
	this.message = message;
};

var ValidationResult = function (isValid) {
	this.isValid = isValid;
	this.errors = [];
};

var resultList = [
	{ id: 1, name: "64 Studio", description: "Attempts to specialize in audio and video production on x86-64 workstations." },
	{ id: 2, name: "aptosid", description: "Multilingual desktop-oriented Live CD based on Debian unstable. Formerly sidux." },
	{ id: 3, name: "Astra Linux", description: "OS developed for Russian Army with raised security." },
	{ id: 4, name: "Bharat", description: "Operating System Solutions	This software is also known by the acronym BOSS Linux." },
	{ id: 5, name: "Canaima", description: "A Venezuelan Linux distribution." },
	{ id: 6, name: "Corel Linux", description: "Commercial. Short-lived desktop Linux distribution, bought by Xandros Linux." },
	{ id: 7, name: "CrunchBang Linux", description: "A small Linux Distro and Live CD based on Debian Stable, featuring the Openbox window manager and tint2 panel with GTK+ applications. Development has ended for CrunchBang as of February, 2015." },
	{ id: 8, name: "deepin", description: "A Debian based distro which is intended to be friendly for non-technical users and particularly aimed at Chinese users." },
	{ id: 9, name: "Devuan", description: "A fork of Debian begun in 2014 with the primary goal of allowing user choice in init systems, by decoupling software packages from systemd." },
	{ id: 10, name: "Dreamlinux", description: "A Brazilian Linux distribution (not active anymore)." },
	{ id: 11, name: "Emdebian Grip", description: "A small-footprint Linux distribution based on and compatible with Debian, intended for use on resource-limited embedded systems." },
	{ id: 12, name: "Finnix", description: "A small system administration Live CD that is available for multiple architectures." },
	{ id: 13, name: "gNewSense", description: "originally based on Ubuntu and later upon Debian, and developed with sponsorship from the Free Software Foundation. Its goal is user-friendliness, but with all proprietary (e.g. binary blobs) and non-free software removed." },
	{ id: 14, name: "grml", description: "Live CD for system recovery." },
	{ id: 15, name: "HandyLinux", description: "A Debian GNU/Linux derivative, designed for seniors equipped with old computers for which Windows has become too slow." },
	{ id: 16, name: "Instant WebKiosk", description: "Live, browser only operating system for use in web kiosks and for digital signage." },
	{ id: 17, name: "Kali Linux", description: "Made to be a completely customizable OS, used for penetration testing. It is based on Debian GNU/Linux." },
	{ id: 18, name: "Kanotix", description: "An installable live DVD/CD for desktop usage using KDE and LXDE, focusing on convenient scripts and GUI for ease of use." },
	{ id: 19, name: "Knoppix", description: "The first Live CD (later DVD) version of Debian GNU/Linux." },
	{ id: 20, name: "Kurumin", description: "Earlier, it was a version of the Knoppix distribution, modified with Debian and designed for Brazilian users." },
	{ id: 21, name: "LEAF Project", description: "The Linux Embedded Appliance Framework. A tiny primarily floppy-based distribution for routers, firewalls and other appliances." },
	{ id: 22, name: "LiMux", description: "An ISO 9241 industry workplace certified Linux distribution, deployed at the City of Munich, Germany." },
	{ id: 23, name: "LinuxBBQ", description: "LinuxBBQ is a plethora of releases for various targets and goals based on Debian Sid GNU/Linux." },
	{ id: 24, name: "Linux Mint Debian Edition", description: "Linux Mint Debian Edition (LMDE) is a rolling Linux distribution based on Debian Testing. It is available in both 32 and 64-bit as a live DVD with a Cinnamon or MATE desktop. The purpose of LMDE is to look identical to the main Linux Mint edition and to provide the same functionality while using Debian as a base." },
	{ id: 25, name: "Maemo", description: "A development platform for hand held devices such as the Nokia N800, N810, and Nokia N900 Internet Tablets and other Linux kernel–based devices." },
	{ id: 26, name: "MEPIS", description: "Focuses on ease of use. Also includes a lightweight variant called antiX. antiX is meant to be used on older computers with limited hardware.[25] There is also a Xfce distro called MX that's based on Debian Stable." },
	{ id: 27, name: "MintPPC", description: "For PowerPC computers. Although MintPPC uses some Mint LXDE code, it is not Linux Mint." },
	{ id: 28, name: "Musix GNU+Linux", description: "A Debian GNU/Linux based distribution, intended for music production, graphic design, audio, video editing, and other tasks. It is built with only free software." },
	{ id: 29, name: "NepaLinux", description: "A Debian and Morphix Linux based distribution focused for desktop usage in Nepali language computing." },
	{ id: 30, name: "OpenZaurus", description: "Debian packages and ROM image for the Sharp Zaurus PDA. Replaced by Ångström distribution." },
	{ id: 31, name: "Pardus", description: "Developed by Turkish National Research Institute of Electronics and Cryptology. Prior to 2013 it used PISI as the package manager, with COMAR as the configuration framework. Starting with Pardus 2013, it is Debian-based." },
	{ id: 32, name: "Parsix", description: "Optimized for personal computers and laptops. Built on top of Debian testing branch and comes with security support." },
	{ id: 33, name: "PelicanHPC", description: "Dedicated to setting up a computer cluster." },
	{ id: 34, name: "Rxart", description: "Desktop-oriented distribution. Focused on providing proprietary software." },
	{ id: 35, name: "Raspbian", description: "Desktop-oriented distribution. Developed by the Raspberry Pi Foundation as the official OS for their family of low-power single-board computers." },
	{ id: 36, name: "Sacix", description: "A Debian Pure Blend originally created to support the educational and free software diffusion goals of the Telecentres project of the city of São Paulo, Brazil." },
	{ id: 37, name: "Siduction", description: "Derived from aptosid, siduction is a distro based on debian sid with a friendly community." },
	{ id: 38, name: "Skolelinux", description: "A Linux distribution from Norway. It is provided as a thin client distribution for schools." },
	{ id: 39, name: "SolydXK", description: "Xfce and KDE desktop focused on stability, security and ease of use." },
	{ id: 40, name: "SparkyLinux", description: "SparkyLinux is a Debian-based Linux distribution which provides ready to use, out of the box operating system with a set of slightly customized lightweight desktops. Sparky is targeted to all the computer’s users who want replace existing, proprietary driven OS to an open-sourced.." },
	{ id: 41, name: "SteamOS", description: "Debian-based and gaming-focused distribution developed by Valve Corporation and designed around the Steam digital distribution platform." },
	{ id: 42, name: "Sunwah Linux", description: "A Chinese Linux distribution." },
	{ id: 43, name: "Symphony OS", description: "Includes the Mezzo desktop environment. Previous versions were based on Knoppix." },
	{ id: 44, name: "SalineOS", description: "Lean, stable and easy-to-use distribution with XFCE as graphical interface." },
	{ id: 45, name: "TAILS", description: "The Amnesic Incognito Live System' or Tails is aimed at preserving privacy and anonymity, with all outgoing connections forced to go through Tor." },
	{ id: 46, name: "TurnKey GNU/Linux", description: "Open source project developing a family of free, Debian-based appliances optimized for ease of use in server-type usage scenarios. Based on Debian since 2012; previously based on Ubuntu." },
	{ id: 47, name: "Ubuntu", description: "A distribution sponsored by Canonical Ltd. and receiving major funding from South African Mark Shuttleworth. Aims to offer a complete and polished desktop on a single DVD." },
	{ id: 48, name: "Univention", description: "Corporate Server	Enterprise distribution with integrated IT infrastructure and identity management system by the company Univention GmbH, Germany. A full version for up to 5 users for tests and for private use can be downloaded for free." },
	{ id: 49, name: "Webconverger", description: "Debian Live based browser only distribution, similar to Google Chrome OS. However based on Firefox & dwm, with no user sign-in, no special hardware required and designed for public places." },
	{ id: 50, name: "Vyatta", description: "Commercial open source network operating system includes routing, firewall, VPN, intrusion prevention and more. Designed to be an open source Cisco replacement." },
	{ id: 51, name: "Xanadu", description: "Light, fast and safe. rolling release Linux distribution based on Debian SID" }
];

var optionList = [
	{ value: 6, textContent: "Sixth Choice" },
	{ value: 7, textContent: "Seventh Choice" },
	{ value: 8, textContent: "Eighth Choice" },
	{ value: 9, textContent: "Nineth Choice" }
];

var serverDelay = function () { 
	return 200 + 2000 * Math.random();
};

window.dummyAjaxService = {
	ajax: function (options) {
		switch(options.url) {
			case "/select/options":
				setTimeout(function () {
					options.success({
						data: optionList
					});
		    	}, serverDelay());
				break;
			case "/get/url":
				var filteredResults = [];

				_(resultList).forEach(function (item) {
					
					var searchTextIsIncluded = item.name.toLowerCase()
		    			.indexOf(options.data.searchText.toLowerCase()) > - 1;
		    		if (searchTextIsIncluded) {
		    			filteredResults.push(item);
		    		}
				});

		    	var elementsPerPage = Number(options.data.elementsPerPage);
		    	var page = Number(options.data.page);

		    	var start = elementsPerPage * (page - 1);
		    	var end = (elementsPerPage * page);
		    	var outputResults = filteredResults.slice(start, end);				

		    	setTimeout(function () {
					options.success({
						data: outputResults,
						totalNumberOfResults: filteredResults.length
					});
		    	}, serverDelay());
				break;
			case "/post/url":
				var errors = [];
				var warnings = [];
				if (options.data.radioField !== "Terzo") {
					var error = new ValidationFeedback("radioField", "Error: you should select the third option.");
					errors.push(error);
				}
				if (options.data.checkField === false) {
					var error = new ValidationFeedback("checkField", "Error: you should check this checkbox.");
					errors.push(error);
				}
				if (options.data.textField !== "R22") {
					var error = new ValidationFeedback("textField", "Error: the only allowed value is R22.");
					errors.push(error);
				}
				if (options.data.textareaField !== "R22") {
					var error = new ValidationFeedback("textareaField", "Warning: the suggested value is R22.");
					warnings.push(error);
				}
				var validationResult = {
					isValid: (errors.length === 0),
					errors: errors,
					warnings: warnings
				};

		    	setTimeout(function () {
					options.success(validationResult);
		    	}, serverDelay());
				break;
			default:
				break;
		}
	}
};