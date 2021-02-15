import { Injectable, TemplateRef } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class HeroService {
  

  constructor(private http: HttpClient, private messageService: MessageService) { }

  private log(message: string){
    this.messageService.add(`HeroService: ${message}`);
  }

  private heroesUrl = 'api/heroes'; //URL para a api web

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type' : 'application/json'})
  };

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log('fetched heroes')), // "tap" repassa os valores observáveis (heróis buscados)
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  /**
   * Tratar o erro da requisição Http que falhou.
   * @param operation - nome da operação que falhou.
   * @param result - valor a ser retornado como resultado do observable.
   */

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); //exibe erro no console
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T); //Deixa o app continuar rodando, retornando um resultado vazio
    }
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** PUT: atualizar dadaos do herói no servidor */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** POST: Adicionar um novo herói ao servidor */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: deletar o herói do servidor */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
  
  /** GET: pega os heróis cujo nome foi digitado na barra de pesquisa */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // se não achar o nome termo pesquisado, retorna um array de heróis vazio
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?
    name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
}

