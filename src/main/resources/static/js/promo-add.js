// funçao para capturar as metatags
$("#linkPromocao").on('change', function() {
	var url = $(this).val();
	var error = false;

	// no minimo http://
	if (url.length > 7) {
		$.ajax({
			method : "POST",
			url : "/meta/info?url=" + url,
			cache : false,
			beforeSend : function() {
				$("#alert").removeClass("alert alert-danger alert-success").text("");
				$("#titulo").val("");
				$("#site").text("");
				$("#linkImagem").attr("src", "");
				$("#loader-img").addClass("loader");
			},
			success : function(data) {
				console.log(data);
				$("#titulo").val(data.title);
				$("#site").text(data.site);
				$("#linkImagem").attr("src", data.image.replace("undefinedxundefined", "800x560"));
			},
			statusCode : {
				404 : function() {
					$("#alert").addClass("alert alert-danger").text("Nenhuma informação pode ser recuperada dessa URL.");
					error = true;
				}
			},
			error : function() {
				$("#alert").addClass("alert alert-danger").text("Ops... algo deu errado, tente novamento mais tarde.");
				error = true;
			},
			complete : function() {
				$("#loader-img").removeClass("loader");
				if (error)
					$("#linkImagem").attr("src", "/images/promo-dark.png");
			}
		})
	}
});

// submit formulario para controller
$("#form-add-promo").submit(function(evt) {
	// bloq comportamento padrao e evitar refresh no navegador
	evt.preventDefault();

	var promo = {};
	promo.linkPromocao = $("#linkPromocao").val();
	promo.descricao = $("#descricao").val();
	promo.preco = $("#preco").val();
	promo.titulo = $("#titulo").val();
	promo.categoria = $("#categoria").val();
	promo.linkImagem = $("#linkImagem").attr("src");
	promo.site = $("#site").text();

	console.log("promocao obj", promo);

	$.ajax({
		method : "POST",
		url : "/promocao/save",
		data : promo,
		beforeSend : function() {
			// removendo mensagens
			$("span").closest('.error-span').remove();

			// remover bordas vermelhas
			$("#categoria").removeClass("is-invalid");
			$("#preco").removeClass("is-invalid");
			$("#linkPromocao").removeClass("is-invalid");
			$("#Titulo").removeClass("is-invalid");

			// habilita o loading
			$("#form-add-promo").hide();
			$("#loader-form").addClass("loader").show();
		},
		success : function() {
			$("#form-add-promo").each(function() {
				this.reset();
			});
			$("#linkImagem").attr("src", "/images/promo-dark.png");
			$("#site").text("");

			$("#alert").removeClass("alert alert-danger").addClass("alert alert-success").text("Ok! Promoção cadastrada com sucesso!");
		},
		statusCode : {
			422 : function(xhr) {
				console.log('> error:', xhr.status);
				var errors = $.parseJSON(xhr.responseText);

				$.each(errors, function(key, val) {
					$("#" + key).addClass("is-invalid");
					$("#error-" + key).addClass("invalid-feedback").append("<span class='error-span'>" + val + "</span>");
				});
			}
		},
		error : function(xhr) {
			console.log("> error:", xhr.responseText);
			$("#alert").addClass("alert alert-danger").text("Não foi possivel salvar esssa promoção.");
		},
		complete : function() {
			$("#loader-form").fadeOut(800, function() {
				$("#form-add-promo").fadeIn(250);
				$("#loader-form").removeClass("loader");
			});
		}
	});
});