$(document).ready(function() {
	moment.locale("pt-br");

	var table = $("#table-server").DataTable({
		processing : true,
		serverSide : true,
		responsive : true,
		lengthMenu : [ 10, 15, 20, 25 ],
		ajax : {
			url : "/promocao/datatables/server",
			data : "data"
		},
		columns : [ {
			data : "id"
		}, {
			data : "titulo",
			render : function(text) {
				return formatText(text);
			}
		}, {
			data : "site"
		}, {
			data : "linkPromocao",
			render : function(text) {
				return formatText(text);
			}
		}, {
			data : "descricao",
			render : function(text) {
				return formatText(text);
			}
		}, {
			data : "linkImagem",
			render : function(text) {
				return formatText(text);
			}
		}, {
			data : "preco",
			render : $.fn.dataTable.render.number(".", ",", 2, "R$")
		}, {
			data : "likes"
		}, {
			data : "dtCadastro",
			render : function(text) {
				return moment(text).format("LLL");
			}
		}, {
			data : "categoria.titulo"
		} ],
		dom : "Bfrtip",
		buttons : [ {
			text : "Editar",
			attr : {
				id : "btn-editar",
				type : "button"
			},
			enabled : false
		}, {
			text : "Excluir",
			attr : {
				id : "btn-excluir",
				type : "button"
			},
			enabled : false
		} ]
	});

	// desmarcar botao ao ordenar
	$("#table-server thead").on("click", "tr", function() {
		table.buttons().disable();
	});

	// marcar e desmarcar botoes
	$("#table-server tbody").on("click", "tr", function() {
		if ($(this).hasClass("selected")) {
			$(this).removeClass("selected");
			table.buttons().disable();
		} else {
			$("tr.selected").removeClass("selected");
			$(this).addClass("selected");
			table.buttons().enable();
		}
	});

	$("#btn-editar").on("click", function() {
		if (isSelectedRow()) {
			var id = getPromoId();

			$.ajax({
				method : "GET",
				url : "/promocao/edit/" + id,
				beforeSend : function() {
					// removendo mensagens
					$("span").closest('.error-span').remove();
					// remover bordas vermelhas
					$(".is-invalid").removeClass("is-invalid");
					$("#modal-form").modal("show");
				},
				success : function(data) {
					$("#edt_id").val(data.id);
					$("#edt_site").text(data.site);
					$("#edt_titulo").val(data.titulo);
					$("#edt_descricao").val(data.descricao);
					$("#edt_preco").val(data.preco.toLocaleString('pt-BR', {
						minimumFractionDigits : 2,
						maximumFractionDigits : 2
					}));
					$("#edt_categoria").val(data.categoria.id);
					$("#edt_linkImagem").val(data.linkImagem);
					$("#edt_imagem").attr("src", data.linkImagem);
				},
				error : function(xhr) {
					alert("Ops ocorreu um erro " + xhr.status + " - " + xhr.statusText)
				}
			});
		}
	});

	$("#btn-excluir").on("click", function() {
		if (isSelectedRow()) {
			$("#modal-delete").modal("show");
			var id = getPromoId();
			console.log("excluir id " + id);
		}
	});

	$("#btn-del-modal").on("click", function() {
		var id = getPromoId();

		$.ajax({
			method : "GET",
			url : "/promocao/delete/" + id,
			success : function() {
				$("#modal-delete").modal("hide");
				table.ajax.reload();
			},
			error : function(xhr) {
				alert("Ops ocorreu um erro " + xhr.status + " - " + xhr.statusText)
			}
		});
	});

	// submit modal
	$("#btn-edit-modal").on('click', function() {
		var promo = {};

		promo.descricao = $("#edt_descricao").val();
		promo.preco = $("#edt_preco").val();
		promo.titulo = $("#edt_titulo").val();
		promo.categoria = $("#edt_categoria").val();
		promo.linkImagem = $("#edt_linkImagem").val();
		promo.id = $("#edt_id").val();

		$.ajax({
			method : "POST",
			url : "/promocao/edit",
			data : promo,
			beforeSend : function() {
				// removendo mensagens
				$("span").closest('.error-span').remove();

				// remover bordas vermelhas
				$(".is-invalid").removeClass("is-invalid");
			},
			success : function() {
				$("#modal-form").modal("hide");
				table.ajax.reload();
			},
			statusCode : {
				422 : function(xhr) {
					console.log('> error:', xhr.status);
					var errors = $.parseJSON(xhr.responseText);

					$.each(errors, function(key, val) {
						$("#edt_" + key).addClass("is-invalid");
						$("#error-" + key).addClass("invalid-feedback").append("<span class='error-span'>" + val + "</span>");
					});
				}
			}
		});
	});

	// alterar imagem no component img
	$("#edt_linkImagem").on("change", function() {
		var link = $(this).val();
		$("#edt_imagem").attr("src", link);
	});

	function formatText(text) {
		return text != "" && text.length >= 40 ? text.substring(0, 40) + "..." : text
	}

	function getPromoId() {
		return table.row(table.$("tr.selected")).data().id;
	}

	function isSelectedRow() {
		var trow = table.row(table.$("tr.selected"));
		return trow.data() != undefined;
	}

});
