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
			$("#modal-form").modal("show");
			var id = getPromoId();
			console.log("editar id " + id);
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
