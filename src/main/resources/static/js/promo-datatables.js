$(document).ready(function() {

	$("#table-server").DataTable({
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
			data : "preco"
		}, {
			data : "likes"
		}, {
			data : "dtCadastro"
		}, {
			data : "categoria.titulo"
		} ]
	});
});

function formatText(text) {
	return text != "" && text.length >= 40 ? text.substring(0, 40) + "..." : text
}