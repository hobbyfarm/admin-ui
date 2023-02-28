import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Step } from '../../data/step';
import { switchMap, concatMap, tap, map, toArray } from 'rxjs/operators';
import { TerminalComponent } from '../terminal/terminal.component';
import { ClrTabContent, ClrTab, ClrModal } from '@clr/angular';
import { Scenario } from '../../data/scenario';
import { Session } from '../../data/Session';
import { from } from 'rxjs';
import { VMClaim } from '../../data/vmclaim';
import { VMClaimVM } from '../../data/vmclaimvm';
import { VirtualMachine as VM } from '../../data/virtualmachine';
import { CtrService } from '../../data/ctr.service';
import { CodeExec } from '../CodeExec';
import { SessionService } from '../../data/session.service';
import { ScenarioService } from '../../data/scenario.service';
import { StepService } from '../../data/step.service';
import { VMClaimService } from '../../data/vmclaim.service';
import { VMService } from '../vm.service';
import { ShellService } from '../../data/shell.service';
import { atou } from '../../unicode';
import { HfMarkdownRenderContext } from '../hf-markdown.component';
import { UserService } from '../../data/user.service';
import { CourseService } from '../../data/course.service';

@Component({
  selector: 'app-step',
  templateUrl: 'step.component.html',
  styleUrls: ['step.component.scss'],
})
export class StepComponent implements OnInit, AfterViewInit, OnDestroy {
  public scenario: Scenario = new Scenario();
  public step: Step = new Step();
  public stepnumber = 0;
  public stepcontent = '';
  private shellStatus: Map<string, string> = new Map();

  public finishOpen = false;
  public closeOpen = false;

  public session: Session = new Session();
  public sessionExpired = false;
  public vms: Map<string, VM> = new Map();

  mdContext: HfMarkdownRenderContext = { vmInfo: {}, session: '' };

  public pauseOpen = false;

  public pauseLastUpdated: Date = new Date();
  public pauseRemainingString = '';
  public username: String = '';
  public courseName: String = '';

  public checkInterval: any;

  @ViewChildren('term') private terms: QueryList<TerminalComponent> =
    new QueryList();
  @ViewChildren('tabcontent') private tabContents: QueryList<ClrTabContent> =
    new QueryList();
  @ViewChildren('tab') private tabs: QueryList<ClrTab>;
  @ViewChild('pausemodal', { static: true }) private pauseModal: ClrModal;
  @ViewChild('contentdiv', { static: false }) private contentDiv: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ctr: CtrService,
    private ssService: SessionService,
    private scenarioService: ScenarioService,
    private stepService: StepService,
    private vmClaimService: VMClaimService,
    private vmService: VMService,
    private shellService: ShellService,
    private userService: UserService,
    private courseService: CourseService
  ) {}

  handleStepContentClick(e: MouseEvent) {
    // Open all links in a new window
    if (e.target instanceof HTMLAnchorElement && e.target.href) {
      e.preventDefault();
      window.open(e.target.href, '_blank');
    }
  }

  getShellStatus(key: string) {
    return this.shellStatus.get(key);
  }

  get isLastStepActive() {
    return this.stepnumber + 1 === this.scenario.stepcount;
  }

  getProgress() {
    return Math.floor(((this.stepnumber + 1) / this.scenario.stepcount) * 100);
  }

  ngOnInit() {
    const { paramMap } = this.route.snapshot;
    const sessionId = paramMap.get('session')!;
    this.stepnumber = Number(paramMap.get('step') ?? 0);

    this.checkInterval = setInterval(() => {
      this.ssService.getStatus(sessionId).subscribe(
        () => {},
        () => {
          this.sessionExpired = true;
          clearInterval(this.checkInterval);
        }
      );
    }, 60000);

    this.ssService
      .get(sessionId)
      .pipe(
        switchMap((s: Session) => {
          this.session = s;
          return this.scenarioService.get(s.scenario);
        }),
        tap((s: Scenario) => {
          this.scenario = s;
          this._loadStep();
          this._loadUser();
          this._loadCourse();
        }),
        switchMap(() => {
          return from(this.session.vm_claim);
        }),
        concatMap((v: string) => {
          return this.vmClaimService.get(v);
        }),
        concatMap((v: VMClaim) => {
          return from(v.vm);
        }),
        concatMap(([k, v]: [string, VMClaimVM]) => {
          return this.vmService
            .get(v.vm_id)
            .pipe(map((vm) => [k, vm] as const));
        }),
        toArray()
      )
      .subscribe(
        (entries) => {
          this.vms = new Map(entries);

          const vmInfo: HfMarkdownRenderContext['vmInfo'] = {};
          for (const [k, v] of this.vms) {
            vmInfo[k.toLowerCase()] = v;
          }
          this.mdContext = { vmInfo, session: this.session.id };
        },
        () => {
          this.sessionExpired = true;
          clearInterval(this.checkInterval);
        }
      );

    this.ctr.getCodeStream().subscribe((c: CodeExec) => {
      // watch for tab changes
      this.tabs.forEach((i: ClrTab) => {
        if (c.target.toLowerCase() == i.tabLink.tabLinkId.toLowerCase()) {
          i.ifActiveService.current = i.id;
        }
      });
    });

    this.shellService.watch().subscribe((ss: Map<string, string>) => {
      this.shellStatus = ss;
    });
  }

  ngAfterViewInit() {
    const sub = this.tabs.changes.subscribe((tabs: QueryList<ClrTab>) => {
      if (tabs.first) {
        tabs.first.tabLink.activate();
        sub.unsubscribe();
      }
    });
  }

  ngOnDestroy() {
    this.terms.forEach((term) => {
      term.mutationObserver.disconnect();
    });
    clearInterval(this.checkInterval);
  }

  goNext() {
    this.stepnumber += 1;
    this.router.navigateByUrl(
      '/session/' + this.session.id + '/steps/' + this.stepnumber
    );
    this._loadStep();
    this.contentDiv.nativeElement.scrollTop = 0;
  }

  private _loadStep() {
    this.stepService
      .get(this.scenario.id, this.stepnumber)
      .subscribe((s: Step) => {
        this.step = s;
        this.step.title = atou(s.title);
        this.stepcontent = atou(s.content);
      });
  }

  private _loadUser() {
    this.userService
      .getUserByID(this.session.user)
      .subscribe((user) => (this.username = user.email));
  }

  private _loadCourse() {
    if (!this.session.course) return;
    this.courseService
      .getCourseById(this.session.course)
      .subscribe((course) => {
        this.courseName = course.name;
      });
  }

  goPrevious() {
    this.stepnumber -= 1;
    this.router.navigateByUrl(
      '/session/' + this.session.id + '/steps/' + this.stepnumber
    );
    this._loadStep();
    this.contentDiv.nativeElement.scrollTop = 0;
  }

  public goFinish() {
    this.finishOpen = true;
  }

  actuallyFinish(force = false) {
    if (this.shouldKeepVmOnFinish && !force) {
      this.router.navigateByUrl('/home');
    } else {
      this.ssService.finish(this.session.id).subscribe(() => {
        this.router.navigateByUrl('/home');
      });
    }
  }

  get shouldKeepVmOnFinish() {
    return this.session.course && this.session.keep_course_vm;
  }

  goClose() {
    this.closeOpen = true;
  }

  actuallyClose() {
    this.router.navigateByUrl('/home');
  }

  isGuacamoleTerminal(protocol: string): boolean {
    return protocol !== 'ssh';
  }

  public dragEnd() {
    // For each tab...
    this.tabContents.forEach((t: ClrTabContent, i: number) => {
      // ... if the active tab is the same as itself ...
      if (t.ifActiveService.current == t.id) {
        // ... resize the terminal that corresponds to the index of the active tab.
        // e.g. tab could have ID of 45, but would be index 2 in list of tabs, so reload terminal with index 2.
        this.terms.toArray()[i].resize();
      }
    });
  }
}
