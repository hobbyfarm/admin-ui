import { Component, OnInit, ViewChild } from '@angular/core';
import { QuizService, Quiz } from '../data/quiz.service';
import { RbacService } from '../data/rbac.service';
import { ClrDatagridSortOrder } from '@clr/angular';
import { AlertComponent } from '../alert/alert.component';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import {
  DEFAULT_ALERT_ERROR_DURATION,
  DEFAULT_ALERT_SUCCESS_DURATION,
} from '../alert/alert';
import { QuizWizardComponent } from './quiz-wizard/quiz-wizard.component';

@Component({
  selector: 'app-quiz-crd',
  templateUrl: './quiz-crd.component.html',
  styleUrls: ['./quiz-crd.component.scss'],
})
export class QuizCrdComponent implements OnInit {
  public quizzes: Quiz[] = [];
  public selectedQuiz: Quiz | null = null;

  // Sort & RBAC
  public ascSort = ClrDatagridSortOrder.ASC;
  public showActionOverflow = false;
  public updateRbac = false;
  public selectRbac = false;

  @ViewChild('alert') alert: AlertComponent;
  @ViewChild('deleteConfirmation') deleteConfirmation: DeleteConfirmationComponent;
  @ViewChild('addNewQuiz', { static: false, read: QuizWizardComponent })
  addNewQuiz!: QuizWizardComponent;

  @ViewChild('editQuiz', { static: false, read: QuizWizardComponent })
  editQuizWizard!: QuizWizardComponent;

  constructor(
    private quizService: QuizService,
    private rbacService: RbacService
  ) {}

  ngOnInit(): void {
    this.setupRbac();
    this.refresh();
  }

  setupRbac() {
    // Check which RBAC actions are permitted
    Promise.all([
      this.rbacService.Grants('quizes', 'get'),
      this.rbacService.Grants('quizes', 'update'),
      this.rbacService.Grants('quizes', 'delete'),
    ]).then(([allowedGet, allowedUpdate, allowDelete]) => {
      this.selectRbac = allowedGet || allowedUpdate;
      this.updateRbac = allowedUpdate;
      this.showActionOverflow = allowDelete || (allowedGet && allowedUpdate);
    });
  }

  refresh() {
    this.quizService.list().subscribe({
      next: (quizzes: Quiz[]) => {
        this.quizzes = quizzes;
      },
      error: () => {
        const msg = 'Failed to load quizzes.';
        this.alert.danger(msg, true, DEFAULT_ALERT_ERROR_DURATION);
      },
    });
  }

  openNewQuizWizard() {
    this.addNewQuiz.openForCreate();
  }

  onQuizSaved(_: { id: string; quiz: Quiz }) {
    this.refresh();
  }

  openEditQuizWizard(quiz: Quiz) {
    this.selectedQuiz = quiz;
    this.editQuizWizard.openForEdit(quiz);
  }

  confirmDelete(quiz: Quiz) {
    this.selectedQuiz = quiz;
    this.deleteConfirmation.open();
  }

  deleteSelectedQuiz() {
    if (!this.selectedQuiz) {
      this.alert.danger(
        'Error deleting quiz: none selected.',
        true,
        DEFAULT_ALERT_ERROR_DURATION
      );
      return;
    }
    this.quizService.delete(this.selectedQuiz.id!).subscribe({
      next: () => {
        this.alert.success('Quiz deleted successfully!', true, DEFAULT_ALERT_SUCCESS_DURATION);
        this.selectedQuiz = null;
        this.refresh();
      },
      error: (e) => {
        this.alert.danger(
          'Error deleting quiz: ' + e.message,
          true,
          DEFAULT_ALERT_ERROR_DURATION
        );
      },
    });
  }
}
