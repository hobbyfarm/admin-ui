import { ScenarioService } from './scenario.service';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { RbacService } from './rbac.service';
import {
  extractResponseContent,
  GargantuaClientFactory,
} from './gargantua.service';
import { Injectable } from '@angular/core';
import { ServerResponse } from './serverresponse';
import { Validation } from '../quiz/Validation';
import { QuestionType } from '../quiz/QuestionType';

export interface QuizAnswer {
  id?: string;
  title: string;
  correct?: boolean;
}

export interface QuizQuestion {
  id?: string;
  title: string;
  description: string;
  type: QuestionType;
  shuffle: boolean;
  failure_message: string;
  success_message: string;
  weight: number;
  answers: QuizAnswer[];
}

export interface Quiz {
  id?: string;
  title: string;
  issuer: string;
  shuffle: boolean;
  pool_size: number;
  max_attempts: number;
  success_threshold: number;
  validation_type: Validation;
  questions: QuizQuestion[];
}

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private cachedQuizList: Quiz[] = [];
  private fetchedList = false;
  private bh: BehaviorSubject<Quiz[]> = new BehaviorSubject(
    this.cachedQuizList,
  );
  private gargAdmin = this.gcf.scopedClient('/a/quiz');
//   private garg = this.gcf.scopedClient('/quiz');

  constructor(
    private gcf: GargantuaClientFactory,
    public scenarioService: ScenarioService,
    public rbacService: RbacService,
  ) {}

  list(force = false): Observable<Quiz[]> {
    if (!force && this.fetchedList) {
      return of(this.cachedQuizList); // Return cached list
    } else {
      return this.gargAdmin.get<ServerResponse>('/list').pipe(
        map(extractResponseContent),
        tap((quizzes: Quiz[]) => {
          this.set(quizzes); // Cache the quizzes
        }),
      );
    }
  }

  get(id: string) {
    return this.gargAdmin.get(`/${id}`).pipe(map(extractResponseContent));
  }

  create(quiz: Quiz): Observable<string> {
    // backend returns the new quiz ID as plain text and a "created" message.
    return this.gargAdmin.post('/create', quiz, { responseType: 'text' });
  }

  update(id: string, quiz: Quiz): Observable<any> {
    return this.gargAdmin.put(`/${id}/update`, quiz);
  }

  delete(id: string): Observable<any> {
    return this.gargAdmin.delete(`/${id}/delete`);
  }

  public watch() {
    return this.bh.asObservable();
  }

  private set(list: Quiz[]) {
    this.cachedQuizList = list;
    this.fetchedList = true;
    this.bh.next(list);
  }
}
