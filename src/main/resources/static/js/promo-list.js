// efeito infinit scroll
$(window).scroll(function() {

	var scrollTop = $(this).scrollTop();
	var conteudo = $(document).height() - $(window).height();

	console.log('conteudo', conteudo);
	console.log('scrolltop', scrollTop);

	if (scrollTop >= conteudo) {
		console.log('***');
	}
});