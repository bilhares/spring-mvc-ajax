var pageNumber = 0;

$(document).ready(function () {
	$("#loader-img").hide();
	$("#fim-btn").hide();
});

// scroll infinito
$(window).scroll(function () {
	var scrollTop = $(this).scrollTop();
	var conteudo = $(document).height() - $(window).height();

	if (scrollTop >= conteudo) {
		pageNumber++;
		setTimeout(function () {
			loadByScrollBar(pageNumber);
		}, 200);
	}
});

function loadByScrollBar(pageNumber) {
	var site = $("#autocomplete-input").val();
	$.ajax({
		method: "GET",
		url: "/promocao/list/ajax",
		data: {
			page: pageNumber,
			site: site
		},
		beforeSend: function () {
			$("#loader-img").show();
		},
		success: function (response) {
			if (response.length > 150) {
				$(".row").fadeIn(250, function () {
					$(this).append(response);
				});
			} else {
				$("#fim-btn").show();
				$("#loader-img").removeClass("loader");
			}
		},
		error: function (xhr) {
			alert("Ops ocorreu um erro " + xhr.status + " - " + xhr.statusText)
		},
		complete: function () {
			$("#loader-img").hide();
		}
	});
}

// controle de likes
$(document).on("click", "button[id*='likes-btn-']", function () {
	var id = $(this).attr("id").split("-")[2];

	$.ajax({
		method: "POST",
		url: "/promocao/like/" + id,
		success: function (response) {
			$("#likes-count-" + id).text(response);
		},
		error: function (xhr) {
			alert("Ops ocorreu um erro " + xhr.status + " - " + xhr.statusText)
		}
	})
});

// autocomplete
$("#autocomplete-input").autocomplete({
	source: function (req, resp) {
		$.ajax({
			method: "GET",
			url: "/promocao/site",
			data: {
				termo: req.term
			},
			success: function (result) {
				resp(result);
			}
		});
	}
});

// botao confirmar
$("#autocomplete-submit").on("click", function () {
	var site = $("#autocomplete-input").val();
	$.ajax({
		method: "GET",
		url: "/promocao/site/list",
		data: {
			site: site
		},
		beforeSend: function () {
			pageNumber = 0;
			$("#fim-btn").hide();
			$(".row").fadeOut(400, function () {
				$(this).empty();
			});
		},
		success: function (resp) {
			$(".row").fadeIn(250, function () {
				$(this).append(resp);
			})
		},
		error: function (xhr) {
			alert("Ops ocorreu um erro " + xhr.status + " - " + xhr.statusText)
		}
	});
});

// SSE
window.onload = init();
var totalOfertas = new Number(0);

function init() {
	const evtSource = new EventSource("/promocao/notificacao");

	evtSource.onopen = (event) => {
		console.log("The connection has been established.");
	};

	evtSource.onmessage = (event) => {
		const count = event.data;
		if (count > 0) showButton(count);
	};
}

function showButton(count) {
	totalOfertas = totalOfertas + new Number(count);
	$("#btn-alert").show(function () {
		$(this)
			.attr("style", "display: block;")
			.text("Veja " + totalOfertas + " nova(s) oferta(s)!");
	});
}

$("#btn-alert").click(function () {
    $.ajax({
        method: "GET",
        url: "/promocao/list/ajax",
        data: {
        	page: 0,
        	site: ''
        },
        beforeSend: function() {
        	pageNumber = 0;
        	totalOfertas = 0;
        	$("#fim-btn").hide();
        	$("#loader-img").addClass("loader");
        	$("#btn-alert").attr("style", "display: none;");
        	$(".row").fadeOut(400, function() {
        		$(this).empty();
			});
		},
        success: function (response, status, xhr) {
        	$("#loader-img").hide();
        	$(".row").fadeIn(250, function() {
        		$(this).append(response)
			});
        },
        error: function(error) {
			console.log("error: ", error)
		}
    });
});
