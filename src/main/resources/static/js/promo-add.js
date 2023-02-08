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
				$("#alert").removeClass("alert alert-danger").text("");
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