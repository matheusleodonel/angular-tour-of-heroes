import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Hero } from '../hero';

import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$!: Observable<Hero[]>;
  
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  // Coloca um termo de pesquisa no fluxo do Observable
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // Espera 300ms após cada pressionamento de tecla antes de considerar o termo na pesquisa
      debounceTime(300),

      // ignora o novo termo se ele for igual ao anterior
      distinctUntilChanged(),

      // muda para uma nova pesquisa observável cada vez que o termo for alterado
      switchMap((term: string) =>
    this.heroService.searchHeroes(term)),
    );
  }

}
