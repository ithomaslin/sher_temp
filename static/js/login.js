'use strict';

;(function(document, window, index) {
	var clientLoginErrors = {
		'BadAuthentication': 'Incorrect username or password.\nIf you entered correct email and password, please read the tooltip to know how to enable "Access for less secure apps".',
    	'NotVerified': 'The account email address has not been verified. You need to access your Google account directly to resolve the issue before logging in here.',
    	'TermsNotAgreed': 'You have not yet agreed to Google\'s terms, acccess your Google account directly to resolve the issue before logging in using here.',
    	'CaptchaRequired': 'A CAPTCHA is required. (not supported, try logging in another tab)',
    	'Unknown': 'Unknown or unspecified error; the request contained invalid input or was malformed.',
    	'AccountDeleted': 'The user account has been deleted.',
    	'AccountDisabled': 'The user account has been disabled.',
    	'ServiceDisabled': 'Your access to the specified service has been disabled. (The user account may still be valid.)',
    	'ServiceUnavailable': 'The service is not available; try again later.'
	};

	var signinBtn = $('#sign-in');
	Array.prototype.forEach.call(signinBtn, function(btn) {
	  	btn.addEventListener('click', function(e) {
	  		e.preventDefault();
	  		var email = $('#email').val(),
		  		password = $('#password').val(),
		  		deviceId = $('#device-id').val(),
		  		ACCOUNT_TYPE_HOSTED_OR_GOOGLE = 'HOSTED_OR_GOOGLE',
		  		URL_LOGIN = 'https://android.clients.google.com/auth',
		  		LOGIN_SERVICE = 'androidsecure';

	  // 		var params = {
	  // 			'Email': email,
	  // 			'Passwd': password,
		 //     	'service': LOGIN_SERVICE,
		 //     	'accountType': ACCOUNT_TYPE_HOSTED_OR_GOOGLE
		 //    }
		 //    console.log(params);

		 //    var xhr = new XMLHttpRequest();
		 //    xhr.open('POST', URL_LOGIN, true);

		 //    var paramsStr = '';
		 //    for (var key in params) {
		 //      paramsStr += '&' + key + '=' + encodeURIComponent(params[key]);
		 //    }

		 //    xhr.onload = function() {
		 //    	if (xhr.status >= 200 && ajax.status < 400) {
		 //    		var response = xhr.responseText;
		 //    		var AUTH_TOKEN = '';
		 //    		console.log(response);
		 //    	} else {

		 //    	}
			// };

			// xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			// xhr.send(paramsStr);
	  	});
	});

}(document, window, 0));