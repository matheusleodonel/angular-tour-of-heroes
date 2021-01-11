import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class HeroService {
  

  constructor(private messageService: MessageService) { }

  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');
    return of(HEROES);
  }

  getHero(id: number): Observable<Hero> {
    const hero2: Hero = { id: 0, name: ''};
    this.messageService.add(`HeroService: fetched hero id=${id}`);
      return of(HEROES.find(hero => hero.id === id)) ? of(HEROES.find(hero => hero.id === id)) : hero2;
  }
}

