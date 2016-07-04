'use strict';

;(function(document, window, index) {

	// detect keypress on search input
	$('.header-search-input').keypress(function(e) {
		if (e.which === 13 && $('.header-search-input').val() != '') {
			alert('You just pressed the "enter" key. And the search query is: ' + $('.header-search-input').val());
		}
	});

	// Toggling action mode
	var actionModeToggle = $(".action-mode-toggle");
    Array.prototype.forEach.call(actionModeToggle, function(toggle) {
    	toggle.addEventListener('click', function() {
    		$('.header-upload-wrapper').removeClass('animated flipOutX flipInX');
    		$('.header-search-wrapper').removeClass('animated flipOutX flipInX');
			if (toggle.checked) {
				// Switching search input and file drop
				$('.header-upload-wrapper').addClass('animated flipOutX');
				setTimeout(function() {
					$('.header-upload-wrapper').css('display', 'none');
					$('.header-search-wrapper').css('display', 'inline-block');
					$('.header-search-wrapper').addClass('animated flipInX');
				}, 300);

				$('#chart-dashboard').removeClass('animated bounceInLeft');
				$('#chart-dashboard').addClass('animated bounceOutLeft');
				setTimeout(function() {
					$('#card-widgets').transition({ y: '-'+$('#chart-dashboard').height()+'px' });
				}, 300);
			} else {
				$('.header-search-wrapper').addClass('animated flipOutX');
				setTimeout(function() {
					$('.header-search-wrapper').css('display', 'none');
					$('.header-upload-wrapper').css('display', 'inline-block');
					$('.header-upload-wrapper').addClass('animated flipInX');
				}, 500);

				$('#card-widgets').transition({ y: '0px' });
				setTimeout(function() {
					$('#chart-dashboard').removeClass('animated bounceOutLeft');
					$('#chart-dashboard').addClass('animated bounceInLeft');
				}, 10);
			}
		});
    });

    /********************************************************************************/

	// feature detection for drag & drop upload
	var isAdvancedUpload = function() {
		var div = document.createElement('div');
		return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
	}();

	// applying the effect for every form
	var forms = $('.box');
	Array.prototype.forEach.call(forms, function(form) {
		var input = form.querySelector('input[type="file"]'),
			label = form.querySelector('label'),
			errorMsg = form.querySelector('.box__error span'),
			restart = form.querySelectorAll('.box__restart'),
			droppedFiles = false;
		var showFiles = function(files) {
			label.textContent = files.length > 1 ? (input.getAttribute('data-multiple-caption') || '').replace('{count}', files.length) : files[0].name;
		};
		var triggerFormSubmit = function() {
			var event = document.createEvent('HTMLEvents');
			event.initEvent('submit', true, false);
			form.dispatchEvent(event);
		};

		// letting the server side to know we are going to make an Ajax request
		var ajaxFlag = document.createElement('input');
		ajaxFlag.setAttribute('type', 'hidden');
		ajaxFlag.setAttribute('name', 'ajax');
		ajaxFlag.setAttribute('value', 1);
		form.appendChild(ajaxFlag);

		// automatically submit the form on file select
		input.addEventListener('change', function(e) {
			showFiles(e.target.files);
			triggerFormSubmit();
		});

		// drag&drop files if the feature is available
		if(isAdvancedUpload) {
			form.classList.add('has-advanced-upload');

			['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function(event) {
				form.addEventListener(event, function(e) {
					// preventing the unwanted behaviours
					e.preventDefault();
					e.stopPropagation();
				});
			});

			['dragover', 'dragenter'].forEach(function(event) {
				form.addEventListener(event, function() {
					form.classList.add('is-dragover');
				});
			});

			['dragleave', 'dragend', 'drop'].forEach(function(event) {
				form.addEventListener(event, function() {
					form.classList.remove('is-dragover');
				});
			});

			form.addEventListener('drop', function(e) {
				droppedFiles = e.dataTransfer.files; // the files that were dropped
				showFiles(droppedFiles);
				triggerFormSubmit();
			});
		}


		// if the form was submitted
		form.addEventListener('submit', function(e) {
			// preventing the duplicate submissions if the current one is in progress
			if(form.classList.contains('is-uploading')) return false;

			form.classList.add('is-uploading');
			form.classList.remove('is-error', 'is-success');
			$('.locale-option').attr('disabled', 'disabled');	// disabling the locale selection menu
			$('.locale-option').removeClass('mdl-color-text--pink');

			if(isAdvancedUpload) {
				e.preventDefault();

				// gathering the form data
				var ajaxData = new FormData(form);
				if(droppedFiles) {
					Array.prototype.forEach.call(droppedFiles, function(file) {
						ajaxData.append(input.getAttribute('name'), file);
					});
				}

				Cookies.set('file_name', $('#file-label').text());

				// ajax request
				var ajax = new XMLHttpRequest();
				ajax.open(form.getAttribute('method'), form.getAttribute('action'), true);

				// firing ajax
				ajax.onload = function() {
					form.classList.remove('is-uploading');
					Cookies.remove('permission_request_sent');

					if(ajax.status >= 200 && ajax.status < 400) {
						var data = JSON.parse(ajax.responseText);
						form.classList.add(data.success == true ? 'is-success' : 'is-error');
						
						if(data.success) {
							var apk = data.package_data
							Cookies.remove('package_name');
							Cookies.set('package_name', apk.package_name);
							console.log(apk);
							
							Cookies.set('locale', 'en');	// resetting the locale

							// updating the DOM
							{
								if (apk.dgn_permissions) {
									$('.label-dgn-permission').css('display', '');
									apk.dgn_permissions[1].forEach(function(item) {
										$('.app-dgn-permissions ul').append('<li class="mdl-list__item"><span class="mdl-list__item-primary-content"><code>'+item+'</code></span></li>');
									});
								} else {
									$('.label-dgn-permission').css('display', 'none');
								}

								if (apk.res_permissions) {
									$('.label-res-permission').css('display', '');
									apk.res_permissions[1].forEach(function(item) {
										$('.app-res-permissions ul').append('<li class="mdl-list__item"><span class="mdl-list__item-primary-content"><code>'+item+'</code></span></li>');
									});
								} else {
									$('.label-res-permission').css('display', 'none');
								}

								if (apk.launcher_icon.length != 0) {
									$('.label-launcher-icon').css('display', '');
									apk.launcher_icon.forEach(function(item) {
										$('.app-launcher-icon ul').append('<li class="mdl-list__item"><span class="mdl-list__item-primary-content"><code>'+item+'</code></span></li>');
									});
								} else {
									$('.label-launcher-icon').css('display', 'none');
								}

								if (apk.uses_features.length != 0) {
									$('.label-uses-features').css('display', '');
									apk.uses_features.forEach(function(item) {
										$('.app-uses-features ul').append('<li class="mdl-list__item"><span class="mdl-list__item-primary-content"><code>'+item+'</code></span></li>');
									});
								} else {
									$('.label-uses-features').css('display', 'none');
								}
							}
							
							// updating the play store stats
							if (data.store_stats.status_code === 200) {
								$('.locale-option').removeAttr('disabled');	// reactivate the locale selection
								$('#en').addClass('mdl-color-text--pink');	// highlighting the selected item
								updateStoreStats(data.store_stats.data);
							} else {
								$('.app-title').html('App Not Found in Play Store.');
								$('.icon-wrapper').html('');
								$('.app-dev').html('');
								$('.app-cat').html('');
								$('.app-user-rate').html('');
								$('.app-desc').html('');
								$('.thumbnails').html('');
								$('.store-stats').addClass('not-found');
							}

						} else {
							errorMsg.textContent = data.error;
							console.log(data.error);
						}
					} else {
						form.classList.remove('is-uploading');
						form.classList.add('is-error');
					}
				};

				ajax.onerror = function()　{
					form.classList.remove('is-uploading');
					console.log('ajax error occurred.')
				};

				ajax.send(ajaxData);
			};
		});

		// restart the form if has a state of error/success
		Array.prototype.forEach.call(restart, function(entry) {
			entry.addEventListener('click', function(e) {
				e.preventDefault();
				form.classList.remove('is-error', 'is-success');
				input.click();
			});
		});

		// Firefox focus bug fix for file input
		input.addEventListener('focus', function() {
			input.classList.add('has-focus');
		});

		input.addEventListener('blur', function() {
			input.classList.remove('has-focus');
		});

	});

	
	var localeList = $('.locale-option');
	Array.prototype.forEach.call(localeList, function(item) {
		item.addEventListener('click', function() {
			if (!this.getAttribute('disabled')) {
				console.log(this);
				// get the current locale and remove the color-styling
				var currentLocale = Cookies.get('locale');
				$('#'+currentLocale).removeClass('mdl-color-text--pink');

				// get the selected locale and reset the locale in cookie
				var selectedLocale = this.getAttribute('value');
				Cookies.set('locale', selectedLocale);

				// highlight the selection based on the selection
				$('#'+selectedLocale).addClass('mdl-color-text--pink');

				var ಠ_ಠ = new FormData();
				ಠ_ಠ.append('hl', selectedLocale);
				ಠ_ಠ.append('pkg_name', Cookies.get('package_name'));

				var ajax = new XMLHttpRequest();
				ajax.open('POST', 'updateajax', true);
				
				ajax.onload = function() {
					if(ajax.status >= 200 && ajax.status < 400) {
						var data = JSON.parse(ajax.responseText);
						if (data.store_stats.status_code === 200) {
							updateStoreStats(data.store_stats.data);
						}
					} else {

					}
				};

				ajax.onerror = function() {

				};

				ajax.send(ಠ_ಠ);
			}
		});
	});

	function updateStoreStats(data) {
		// clear out previous state
		$('.store-stats').removeClass('not-found');
		$('.thumbnails').html('');
		$('.app-dev-link ul').html('');

		$('.icon-wrapper').html('<img class="app-icon" src="'+data.app_icon[0]+'">');
		$('.app-title').html(data.app_title);
		$('.app-dev').html(data.developer);
		$('.app-cat').html(data.category);
		$('.app-user-rate').html(data.user_rating);
		$('.app-desc').html('<p>'+data.description+'</p>');
		
		data.screenshots.forEach(function(item) {
			$('.thumbnails').append('<img src="'+item+'" alt="">');
		});

		data.dev_link.forEach(function(item) {
			$('.app-dev-link ul').append('<li class="mdl-list__item"><span class="mdl-list__item-primary-content"><a href="'+item.href+'" target="_blank">'+item.text+'</a></span></li>');
		});
	}

}(document, window, 0));