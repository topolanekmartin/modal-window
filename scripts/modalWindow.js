(function ($) {

	MT = window.MT || {};
	MT.modalWindow = MT.modalWindow || {};

	// Initialize default values
	MT.modalWindow.defaultOptions = {
		selector: {
			outer: '.js-modal-window', // Outer element
			inner: '.js-modal-window-in' // Inner element
		},
		extraClasses: {
			outer: '',
			inner: ''
		},
		iframeUrl: '', // Serves for show iframe
		html: '', // Modal window content
		duration: 0, // Duration of how long should be modal window visible
		animated: true, // Should be show and hide animated
		animationSpeed: 'fast', // Animation speed
		overlay: true, // Should be visible overlay
		onComplete: null
	};

	// Create global variable with custom config options
	MT.modalWindow.options = {};

	MT.modalWindow.create = function (options) {
		var $outerElement = $(options.selector.outer);
		var $innerElement = $(options.selector.inner);

		if (options.html != '') {
			$innerElement.html(options.html);
		}

		// Add extra classes if it is specified in options
		if (options.extraClasses.outer != '') {
			$outerElement.addClass(options.extraClasses.outer);
		}

		if (options.extraClasses.inner != '') {
			$outerElement.addClass(options.extraClasses.inner);
		}
	};

	MT.modalWindow.destroy = function () {
		// Remove extra classes if it is specified in options
		if (MT.modalWindow.options.extraClasses.outer != '') {
			$(MT.modalWindow.options.selector.outer).removeClass(MT.modalWindow.options.extraClasses.outer);
		}

		if (MT.modalWindow.options.extraClasses.inner != '') {
			$(MT.modalWindow.options.selector.inner).removeClass(MT.modalWindow.options.extraClasses.inner);
		}

		// Empty content of modal window
		$(MT.modalWindow.options.selector.inner).empty();

		// Empty custom config options
		MT.modalWindow.options = {};
	};

	MT.modalWindow.show = function (options) {
		MT.modalWindow.options = $.extend({}, MT.modalWindow.defaultOptions, options);
		var options = MT.modalWindow.options;

		if (!$(MT.modalWindow.options.selector.outer).is(':visible')) {
			// Function called after modal window is shown
			var onShowComplete = function () {
				if (options.overlay) {
					$('body').addClass('window-activated');
					$('.js-window-overlay').addClass('js-modal-window-close');
				}

				if (options.onComplete !== null && typeof options.onComplete == 'function') {
					options.onComplete();
				}

				if (options.duration > 0) {
					setTimeout(function () {
						MT.modalWindow.hide();
					}, MT.modalWindow.options.duration);
				}
			};

			var showModal = function () {
				$(options.selector.outer).css('display', 'flex');
				$(options.selector.inner).show({
					duration: options.animated ? options.animationSpeed : 0,
					complete: onShowComplete
				});
			};

			// Create
			MT.modalWindow.create(options);

			if (options.iframeUrl != '') {
				// If content is iframe
				var $iframe = $('<iframe class="js-modal-window-iframe"></iframe>');

				$iframe.on('load', function () {
					// Set correct width and height modal window according iframe content
					if ($(this).contents().length > 0) {
						$(options.selector.outer).css('display', 'flex');
						$(this).css({
							'height': $(this).contents().find('html')[0].scrollHeight + 'px',
							'width': $(this).contents().find('html')[0].scrollWidth + 'px'
						});

						// Handle click on close icon inside iframe
						$(this).contents().find('.js-modal-window-close').click(function (event) {
							event.preventDefault();
							MT.modalWindow.hide();
						});
						$(options.selector.outer).css('display', '');
					}

					// Show modal
					showModal();
				});

				// Trigger iframe onload function
				$(options.selector.inner).append($iframe.attr('src', options.iframeUrl));
			} else {
				// If content is HTML
				showModal();
			}
		}
	};

	MT.modalWindow.hide = function (onComplete) {
		if ($(MT.modalWindow.options.selector.outer).is(':visible')) {
			var options = MT.modalWindow.options;

			// Function called after modal window is hidden
			var onHideComplete = function () {
				if (options.overlay) {
					$('body').removeClass('window-activated');
					$('.js-window-overlay').removeClass('js-modal-window-close');
				}

				if (typeof onComplete === 'function') {
					onComplete();
				}

				// Destroy
				MT.modalWindow.destroy();

				$(options.selector.outer).css('display', '');
				$(options.selector.inner).css('display', '');
			};

			// Hide
			$(options.selector.inner).hide({
				duration: options.animated ? MT.modalWindow.options.animationSpeed : 0,
				complete: onHideComplete
			});
		}
	}

	$(document).ready(function () {
		// Initialize event for hidding modal window
		$(document).on('click', '.js-modal-window-close', function (event) {
			event.preventDefault();
			if (event.target !== this) {
				return;
			}

			MT.modalWindow.hide();
		});
	});

})(jQuery)
