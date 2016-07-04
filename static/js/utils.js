'use strict';

var Utils = {
	SDK_LIST: {
		'4':  'Donut 1.6',
	    '5':  'Eclair 2.0',
	    '6':  'Eclair 2.0.1',
	    '7':  'Eclair 2.1',
	    '8':  'Froyo 2.2-2.2.3',
	    '9':  'Gingerbread 2.3-2.3.2',
	    '10': 'Gingerbread 2.3.3-2.3.7',
	    '11': 'Honeycomb 3.0',
	    '12': 'Honeycomb 3.1',
	    '13': 'Honeycomb 3.2',
	    '14': 'Ice Cream Sandwich 4.0-4.0.2',
	    '15': 'Ice Cream Sandwich 4.0.3-4.0.4',
	    '16': 'Jelly Bean 4.1',
	    '17': 'Jelly Bean 4.2',
	    '18': 'Jelly Bean 4.3',
	    '19': 'KitKat 4.4',
	    '20': 'KitKat (wearable extensions) 4.4',
	    '21': 'Lollipop 5.0',
	    '22': 'Lolipop 5.1',
	    '23': 'Marshmallow 6.0'
	},
	DEVICE_LIST: {
		'hammerhead':   'Nexus 5',
		'shamu': 		'Nexus 6',
		'bullhead': 	'Nexus 5X',
		'angler': 		'Nexus 6P'
	},
	DEFAULT_SIM_SETTINGS: {
	  country: 'USA',
	  operator: 'T-Mobile',
	  operatorCode: '31020'
	},
	DEFAULT_DEVICE: {
	  sdk: '23',
	  codename: 'hammerhead'
	},
	saveAccount: function(data, callback) {
		var accountInfo = new FormData();
		for (var i in data) {
			if (typeof data[i] !== 'function') {
				accountInfo.append(i, data[i]);
			}
		}

		var ajax = new XMLHttpRequest();
        ajax.open('POST', 'account', true);
        
        ajax.onload = function() {
        	if(ajax.status >= 200 && ajax.status < 400) {
        		var data = JSON.parse(ajax.responseText);
            	if (data.success) {
            		console.log(data);
            	}
        	} else {

        	}
        };

        ajax.onerror = function() {
        };
        ajax.send(accountInfo);
	},
	setSimSettings: function(sim, callback) {

	},
	getAccount: function(callback) {
		// TODO: retrieve account details from SQL database
	}
};

function emailValidator(email) {
    var emailReg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    // Return true if it's a valid email address
    return emailReg.test(email);
}