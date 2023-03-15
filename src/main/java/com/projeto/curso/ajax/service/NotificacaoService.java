package com.projeto.curso.ajax.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.projeto.curso.ajax.domain.Emissor;
import com.projeto.curso.ajax.repository.PromocaoRepository;

@EnableScheduling
@Service
public class NotificacaoService {

	@Autowired
	private PromocaoRepository repository;

	private CopyOnWriteArrayList<Emissor> emissores = new CopyOnWriteArrayList<Emissor>();

	public CopyOnWriteArrayList<Emissor> getEmissores() {
		return emissores;
	}

	public void onOpen(Emissor emissor) throws IOException {
		emissor.getEmitter().send(SseEmitter.event().data(" ").id(emissor.getId()));
	}

	public void addEmissor(Emissor emissor) {
		this.emissores.add(emissor);
	}

	public void removeEmissor(Emissor emissor) {
		this.emissores.remove(emissor);
	}

	// 60 mil ms igual a 60 segundos
	@Scheduled(fixedRate = 35000)
	public void notificar() {
		List<Emissor> emissoresErrors = new ArrayList<>();
		this.emissores.forEach(emissor -> {
			try {
				Map<String, Object> map = repository.countAndMaxNovasPromocoesByDtCadastro(emissor.getUltimaData());
				long count = (long) map.get("count");
				if (count > 0) {
					emissor.setUltimaData((LocalDateTime) map.get("lastDate"));

					emissor.getEmitter().send(SseEmitter.event().data(count).id(emissor.getId()));

				}
			} catch (IOException e) {
				emissoresErrors.add(emissor);
			}
		});

		this.emissores.removeAll(emissoresErrors);
	}
}
