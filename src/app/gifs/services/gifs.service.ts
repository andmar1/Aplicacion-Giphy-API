import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';


@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey:string = 'I5KGteDeXt27IgGTrqEdiCIpXpZ00bjB';

  private servicio_Url:string = 'https://api.giphy.com/v1/gifs'

  private _historial: string[]=[];

  //TODO: cambiar any por su tipo 
  public resultados:Gif[] = [];

  get historial(){
    return [...this._historial]
  }

  constructor( private http: HttpClient){

    //almacenar informacion en local storage cada que refrescamos la pagina, dejar arreglo vacio si se borrar localstorage
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];

    //resultados para el localstorage
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];




    //Segunda forma
    // if (localStorage.getItem('historial')) {
    //   this._historial = JSON.parse(localStorage.getItem('historial')!);
    // }

  }

  buscarGifs( query:string = ''){

    query = query.trim().toLowerCase(); //Capitalizar 

    if( !this._historial.includes( query ) ){   //verificar si no se repiten los elementos
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10); //Definir el tamaño de los elementos en el arreglo

      localStorage.setItem('historial', JSON.stringify( this._historial ));

    }

    //con http podemos hacer peticiones 

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);


    this.http.get<SearchGifsResponse>(`${this.servicio_Url}/search`, { params })
    .subscribe( ( resp ) => {
      this.resultados = resp.data;  
      localStorage.setItem('resultados', JSON.stringify( this.resultados))

    });

  }
  
}

//https://api.giphy.com/v1/gifs/search?api_key=I5KGteDeXt27IgGTrqEdiCIpXpZ00bjB&q=naruto&limit=10

//Los get son de tipo generico