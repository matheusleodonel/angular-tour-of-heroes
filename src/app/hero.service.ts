import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class HeroService {
  

  constructor(private http: HttpClient, private messageService: MessageService) { }

  private log(message: string){
    this.messageService.add(`HeroService: ${message}`);
  }

  private heroesUrl = 'api/heroes'; //URL para a api web

  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');
    return this.http.get<Hero[]>(this.heroesUrl);
  }

  getHero(id: number): Observable<Hero> {
    const hero2: Hero = { id: 0, name: ''};
    this.messageService.add(`HeroService: fetched hero id=${id}`);
      return of(HEROES.find(hero => hero.id === id)) ? of(HEROES.find(hero => hero.id === id)) : hero2;
  }
}

