package com.projeto.curso.ajax.web.controller;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.projeto.curso.ajax.domain.Emissor;
import com.projeto.curso.ajax.repository.PromocaoRepository;
import com.projeto.curso.ajax.service.NotificacaoService;

@Controller
public class NotificacaoController {

	@Autowired
	PromocaoRepository repository;

	@Autowired
	NotificacaoService service;

	@GetMapping("/promocao/notificacao")
	public SseEmitter enviarNotificacao() throws IOException {
		SseEmitter emitter = new SseEmitter(0L);

		Emissor emissor = new Emissor(emitter, getDtCadastroUltimaPromocao());
		service.onOpen(emissor);
		service.addEmissor(emissor);

		emissor.getEmitter().onCompletion(() -> service.removeEmissor(emissor));

		System.out.println("> List users size: " + service.getEmissores().size());

		return emissor.getEmitter();
	}

	private LocalDateTime getDtCadastroUltimaPromocao() {
		return repository.findPromocaoComUltimaData();
	}
}
