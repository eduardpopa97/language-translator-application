package com.app.languageTranslatorService;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.Clip;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.UnsupportedAudioFileException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ibm.cloud.sdk.core.security.IamAuthenticator;

import com.ibm.watson.language_translator.v3.LanguageTranslator;
import com.ibm.watson.language_translator.v3.model.TranslateOptions;
import com.ibm.watson.language_translator.v3.model.TranslationResult;

import com.ibm.watson.text_to_speech.v1.TextToSpeech;
import com.ibm.watson.text_to_speech.v1.model.SynthesizeOptions;
import com.ibm.watson.text_to_speech.v1.util.WaveUtils;


@RestController
@SpringBootApplication
public class LanguageTranslatorServiceApplication {

	private String apikeyTranslator = "XXXXXXXXXXXXXXXXXXXXXXX";
	private String versionTranslator = "2018-05-01";
	private String urlTranslator = "https://api.eu-gb.language-translator.watson.cloud.ibm.com";
	
	private String apikeySpeech = "XXXXXXXXXXXXXXXXXXXXXXX";
	private String urlSpeech = "https://api.eu-gb.text-to-speech.watson.cloud.ibm.com";
	
	public static void main(String[] args) {
		SpringApplication.run(LanguageTranslatorServiceApplication.class, args);
	}

	
	@CrossOrigin(origins = "http://localhost:4200")
	@RequestMapping("/api/translate")
	public List<Object> getTranslatedText(
			@RequestParam(required = false, value = "text") String text,
			@RequestParam(required = false, value = "model") String model) throws UnsupportedAudioFileException, IOException, LineUnavailableException
	{
		IamAuthenticator authenticator = new IamAuthenticator(apikeyTranslator);
		LanguageTranslator languageTranslator = new LanguageTranslator(versionTranslator, authenticator);
		languageTranslator.setServiceUrl(urlTranslator);
		
		TranslateOptions translateOptions = new TranslateOptions.Builder()
				  .addText(text)
				  .modelId(model)
				  .build();
		
		TranslationResult result = languageTranslator.translate(translateOptions)
				  .execute()
				  .getResult();

		List<Object> response = new ArrayList<Object>();
		response.add(result.getTranslations());
		return response;
	}
	
	@CrossOrigin(origins = "http://localhost:4200")
	@RequestMapping("/api/listening")
	public void getSpeech(
			@RequestParam(required = false, value = "text") String text,
			@RequestParam(required = false, value = "voice") String voice) throws UnsupportedAudioFileException, IOException, LineUnavailableException 
	{
		IamAuthenticator authenticator = new IamAuthenticator(apikeySpeech);
		TextToSpeech textToSpeech = new TextToSpeech(authenticator);
		textToSpeech.setServiceUrl(urlSpeech);
		
		try 
		{
			  SynthesizeOptions synthesizeOptions =
			    new SynthesizeOptions.Builder()
			      .text(text)
			      .accept("audio/wav")
			      .voice(voice)
			      .build();

			  InputStream inputStream =
			    textToSpeech.synthesize(synthesizeOptions).execute().getResult();
			  InputStream in = WaveUtils.reWriteWaveHeader(inputStream);

			  OutputStream out = new FileOutputStream("IBMWatsonSpeech.wav");
			  byte[] buffer = new byte[1024];
			  int length;
			  while ((length = in.read(buffer)) > 0) {
			    out.write(buffer, 0, length);
			  }

			  out.close();
			  in.close();
			  inputStream.close();
			  
		} 
		catch (IOException e) 
		{
			  e.printStackTrace();
		}
		
		
		AudioInputStream audioInputStream = AudioSystem.getAudioInputStream(
				new File("D:\\facultate\\Anul 5\\"
						+ "echipamente de calcul de inalta performanta\\"
						+ "proiect Cloud\\languageTranslatorService\\"
						+ "languageTranslatorService\\IBMWatsonSpeech.wav").getAbsoluteFile());
        Clip clip = AudioSystem.getClip();
        clip.open(audioInputStream);
        clip.start();
	}
	
	

}
