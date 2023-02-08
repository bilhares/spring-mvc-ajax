package com.projeto.curso.ajax.service;

import java.io.IOException;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.projeto.curso.ajax.domain.SocialMetaTag;

@Service
public class SocialMetaTagService {

	private static Logger log = LoggerFactory.getLogger(SocialMetaTagService.class);

	public SocialMetaTag getSocialMetaTagByUrl(String url) {
		SocialMetaTag twitter = getTwitterCardByUrl(url);
		if (!isEmpty(twitter)) {
			return twitter;
		}

		SocialMetaTag og = getOpenGraphByUrl(url);
		if (!isEmpty(og)) {
			return og;
		}

		return null;
	}

	private SocialMetaTag getOpenGraphByUrl(String url) {
		SocialMetaTag tag = new SocialMetaTag();
		try {
			Document doc = Jsoup.connect(url).userAgent("Mozilla").header("Accept", "text/html")
					.header("Accept-Encoding", "gzip,deflate")
					.header("Accept-Language", "it-IT,en;q=0.8,en-US;q=0.6,de;q=0.4,it;q=0.2,es;q=0.2")
					.header("Connection", "keep-alive").ignoreContentType(true).get();
			tag.setTitle(doc.head().select("meta[property=og:title]").attr("content"));
			tag.setSite(doc.head().select("meta[property=og:site_name]").attr("content"));
			tag.setImage(doc.head().select("meta[property=og:image]").attr("content"));

			String urlMt = doc.head().select("meta[property=og:url]").attr("content");
			tag.setUrl(urlMt.isEmpty() ? url : urlMt);

		} catch (IOException e) {
			log.error(e.getMessage(), e.getCause());
		}

		return tag;
	}

	private SocialMetaTag getTwitterCardByUrl(String url) {
		SocialMetaTag tag = new SocialMetaTag();
		try {
			Document doc = Jsoup.connect(url).userAgent("Mozilla").header("Accept", "text/html")
					.header("Accept-Encoding", "gzip,deflate")
					.header("Accept-Language", "it-IT,en;q=0.8,en-US;q=0.6,de;q=0.4,it;q=0.2,es;q=0.2")
					.header("Connection", "keep-alive").ignoreContentType(true).get();
			tag.setTitle(doc.head().select("meta[name=twitter:title]").attr("content"));
			tag.setSite(doc.head().select("meta[name=twitter:site]").attr("content"));
			tag.setImage(doc.head().select("meta[name=twitter:image]").attr("content"));

			String urlMt = doc.head().select("meta[name=twitter:url]").attr("content");
			tag.setUrl(urlMt.isEmpty() ? url : urlMt);

		} catch (IOException e) {
			log.error(e.getMessage(), e.getCause());
		}

		return tag;
	}

//	private SocialMetaTag getSchemaOrgByUrl(String url) {
//		String url = "https://example.com/product";
//		Document doc = Jsoup.connect(url).get();
//		String html = doc.html();
//		JsonLdOptions options = new JsonLdOptions();
//		options.setUseRdfType(true);
//		JsonLdProcessor processor = new JsonLdProcessor();
//		Object json = processor.fromRdf(html, options);
//	}

	private boolean isEmpty(SocialMetaTag tag) {
		if (tag.getImage() == null || tag.getImage().isEmpty())
			return true;
		if (tag.getSite() == null || tag.getSite().isEmpty())
			return true;
		if (tag.getTitle() == null || tag.getTitle().isEmpty())
			return true;

		return false;
	}
}
