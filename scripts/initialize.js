(function ($) {

	MT = window.MT || {};

	$(document).ready(function () {
		$('.js-modal-open').click(function (event) {
			event.preventDefault();
			var modalText = $(this).data('modal-text');

			MT.modalWindow.show({
				html: modalText,
				animated: true
			});
		});

		$('.js-modal-open-iframe').click(function (event) {
			event.preventDefault();
			var modalIframe = $(this).data('modal-iframe');

			MT.modalWindow.show({
				iframeUrl: modalIframe,
				animated: true
			});
		});
	});

})(jQuery);
