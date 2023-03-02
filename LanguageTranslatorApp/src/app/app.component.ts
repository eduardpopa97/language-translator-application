import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { AlertService } from 'ngx-alerts';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'LanguageTranslatorApp';

  constructor(private http: HttpClient, private alertService: AlertService) {}

  translationModel: string = '';
  fetchedTranslation: any;
  voice: string = '';

  translate(text: string, lang1: string, lang2: string) {
    
    if(text === '')
    {
      this.alertService.warning("Please type a text for translation");
    }
    else
    {
      if(typeof lang1 === 'undefined')
      {
        this.alertService.warning("You haven't selected the language of original text");
      }
      else
      {
        if(typeof lang2 === 'undefined')
        {
          this.alertService.warning("You haven't selected the language of translated text");
        }
        else
        {
          if(lang1 === lang2)
          {
            this.alertService.warning("Both selected languages are the same");
          }
          else
          {
            this.translationModel = '';
            
            if(lang1 == "English")    this.translationModel = this.translationModel + "en-";
            if(lang1 == "Spanish")    this.translationModel = this.translationModel + "es-";
            if(lang1 == "Portuguese") this.translationModel = this.translationModel + "pt-";
            if(lang1 == "French")     this.translationModel = this.translationModel + "fr-";
            if(lang1 == "German")     this.translationModel = this.translationModel + "de-";
            if(lang1 == "Japanese")   this.translationModel = this.translationModel + "ja-";
            if(lang1 == "Italian")    this.translationModel = this.translationModel + "it-";
            if(lang1 == "Swedish")    this.translationModel = this.translationModel + "sv-";
            if(lang1 == "Danish")     this.translationModel = this.translationModel + "da-";
            if(lang1 == "Hungarian")  this.translationModel = this.translationModel + "hu-";
            if(lang1 == "Turkish")    this.translationModel = this.translationModel + "tr-";
            if(lang1 == "Greek")      this.translationModel = this.translationModel + "el-";
            if(lang1 == "Romanian")   this.translationModel = this.translationModel + "ro-";
            if(lang1 == "Dutch")      this.translationModel = this.translationModel + "nl-";
      
            if(lang2 == "English")    this.translationModel = this.translationModel + "en";
            if(lang2 == "Spanish")    this.translationModel = this.translationModel + "es";
            if(lang2 == "Portuguese") this.translationModel = this.translationModel + "pt";
            if(lang2 == "French")     this.translationModel = this.translationModel + "fr";
            if(lang2 == "German")     this.translationModel = this.translationModel + "de";
            if(lang2 == "Japanese")   this.translationModel = this.translationModel + "ja";
            if(lang2 == "Italian")    this.translationModel = this.translationModel + "it";
            if(lang2 == "Swedish")    this.translationModel = this.translationModel + "sv";
            if(lang2 == "Danish")     this.translationModel = this.translationModel + "da";
            if(lang2 == "Hungarian")  this.translationModel = this.translationModel + "hu";
            if(lang2 == "Turkish")    this.translationModel = this.translationModel + "tr";
            if(lang2 == "Greek")      this.translationModel = this.translationModel + "el";
            if(lang2 == "Romanian")   this.translationModel = this.translationModel + "ro";
            if(lang2 == "Dutch")      this.translationModel = this.translationModel + "nl";
            

            console.log(this.translationModel);

            let params = new HttpParams().set("text", text).set("model", this.translationModel);

            this.http.get('http://localhost:8080/api/translate', {params: params}).subscribe(
              (result) => {
                  console.log(result);
                  for (let cloud of JSON.parse(JSON.stringify(result))) {
                      this.fetchedTranslation = cloud[0].translation;
                  }
              },
              (error) => {
                  this.alertService.danger("The language pair is not customizable!");
              }
            )
          }
        }
      }
    }

  
  }

  speech1(text: string, lang1: string)
  {
      this.voice = '';
      if(lang1 == "English")     this.voice = "en-US_AllisonV3Voice";
      if(lang1 == "German")      this.voice = "de-DE_DieterV3Voice";
      if(lang1 == "Spanish")     this.voice = "es-ES_LauraVoice";
      if(lang1 == "Portuguese")  this.voice = "pt-BR_IsabelaV3Voice";
      if(lang1 == "French")      this.voice = "fr-FR_NicolasV3Voice";
      if(lang1 == "Italian")     this.voice = "it-IT_FrancescaV3Voice";
      if(lang1 == "Japanese")    this.voice = "ja-JP_EmiV3Voice";
      if(lang1 == "Dutch")       this.voice = "nl-NL_LiamVoice";
      if(this.voice === '') 
      {
        this.alertService.warning("The Text-to-Speech service has no support for the selected language");
      }

      if(text === '')
      {
        this.alertService.warning("Please type a text for listening");
      }
      else
      {
        let params = new HttpParams().set("text", text).set("voice", this.voice);
        this.http.get('http://localhost:8080/api/listening', {params: params}).subscribe();
      }
  }

  speech2(lang2: string)
  {
      this.voice = '';
      if(lang2 == "English")     this.voice = "en-US_AllisonV3Voice";
      if(lang2 == "German")      this.voice = "de-DE_DieterV3Voice";
      if(lang2 == "Spanish")     this.voice = "es-ES_LauraVoice";
      if(lang2 == "Portuguese")  this.voice = "pt-BR_IsabelaV3Voice";
      if(lang2 == "French")      this.voice = "fr-FR_NicolasV3Voice";
      if(lang2 == "Italian")     this.voice = "it-IT_FrancescaV3Voice";
      if(lang2 == "Japanese")    this.voice = "ja-JP_EmiV3Voice";
      if(lang2 == "Dutch")       this.voice = "nl-NL_LiamVoice";
      if(this.voice === '') 
      {
        this.alertService.warning("The Text-to-Speech service has no support for the selected language");
      }

      if(this.fetchedTranslation === '')
      {
        this.alertService.warning("Please do a translation to listen the result");
      }
      else
      {
        let params = new HttpParams().set("text", this.fetchedTranslation).set("voice", this.voice);
        this.http.get('http://localhost:8080/api/listening', {params: params}).subscribe();
      }
  }


}
