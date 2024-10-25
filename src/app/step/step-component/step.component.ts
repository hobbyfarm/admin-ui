import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Input,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Step } from '../../data/step';
import {
  switchMap,
  concatMap,
  tap,
  map,
  toArray,
  first,
  mergeMap,
  withLatestFrom,
  catchError,
} from 'rxjs/operators';
import { TerminalComponent } from '../terminal/terminal.component';
import { ClrTabContent, ClrTab, ClrModal } from '@clr/angular';
import { Scenario } from '../../data/scenario';
import { Session } from '../../data/Session';
import { forkJoin, from, Observable, of, Subject } from 'rxjs';
import { VMClaim } from '../../data/vmclaim';
import { VMClaimVM } from '../../data/vmclaimvm';
import {
  VirtualMachineTypeShared,
  VirtualMachine as VM,
} from '../../data/virtualmachine';
import { CtrService } from '../../data/ctr.service';
import { CodeExec } from '../../data/CodeExec';
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
import { JwtHelperService } from '@auth0/angular-jwt';
import { addJwtAllowedDomain } from 'src/app/app.module';
import { ScheduledeventService } from 'src/app/data/scheduledevent.service';

type Service = {
  name: string;
  port: number;
  path: string;
  hasOwnTab: boolean;
  hasWebinterface: boolean;
  disallowIFrame: boolean;
  active: boolean;
};

interface stepVM extends VM {
  webinterfaces?: Service[];
  name?: string;
}

export type webinterfaceTabIdentifier = {
  vmId: string;
  port: number;
};

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
  public vms: Map<string, stepVM> = new Map();

  mdContext: HfMarkdownRenderContext = { vmInfo: {}, session: '' };

  public pauseOpen = false;

  public pauseLastUpdated: Date = new Date();
  public pauseRemainingString = '';
  public username: String = '';
  public courseName: String = '';

  @Input() public isUserSession: boolean = true;
  @Input() public vmId?: string;
  @Input() public vmName?: string;

  public maxInterfaceTabs: number = 10;
  private activeWebinterface: Service;

  private reloadTabSubject: Subject<webinterfaceTabIdentifier> =
    new Subject<webinterfaceTabIdentifier>();
  public reloadTabObservable: Observable<webinterfaceTabIdentifier> =
    this.reloadTabSubject.asObservable();

  public checkInterval: any;
  public sharedVMs: stepVM[] = [];

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
    private courseService: CourseService,
    private jwtHelper: JwtHelperService,
    private scheduledEventService: ScheduledeventService
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
    if (this.isUserSession) {
      this.initForUserSession();
    } else {
      this.initForSharedVM();
    }
  }

  initForSharedVM() {
    this.vmService
      .get(this.vmId)
      .pipe(
        tap((res: VM) => this.vms.set(this.vmName, res)),
        switchMap((vm: stepVM) => {
          return this.vmService.getWebinterfaces(vm.id);
        })
      )
      .subscribe((res) => {
        this.vms.get(this.vmName).webinterfaces = JSON.parse(
          JSON.parse(atob(res.content))
        );
      });
  }

  initForUserSession() {
    const { paramMap } = this.route.snapshot;
    const sessionId = paramMap.get('session')!;
    this.stepnumber = Number(paramMap.get('step') ?? 0);

    if (!sessionId) {
      // Something went wrong ... the route snapshot should always contain the sessionId
      return;
    }

    this.checkInterval = setInterval(() => {
      this.ssService.getStatus(sessionId).subscribe({
        error: () => {
          this.sessionExpired = true;
          clearInterval(this.checkInterval);
        },
      });
    }, 60000);

    this.ssService
      .get(sessionId)
      .pipe(
        switchMap((sess: Session) => {
          return this.getSharedVMs(sess);
        }),
        switchMap((sess: Session) => {
          return this.getSharedVMNameFromEvent(sess);
        }),
        switchMap((s: Session) => {
          return this.getScenario(s);
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
          return this.vmService.get(v.vm_id).pipe(
            first(),
            tap((vm) => addJwtAllowedDomain(vm.ws_endpoint)), //Allow JwtModule to intercept and add the JWT on shell-server requests
            map((vm) => [k, vm] as const)
          );
        }),
        toArray(),
        mergeMap((entries: (readonly [string, VM])[]) => {
          this.buildVMSMapWithSharedVMs(entries);

          const vmObservables = this.getWebinterfaces();
          // Using forkJoin to ensure that all inner observables complete, before we return their combined output
          return forkJoin(vmObservables);
        })
      )
      .subscribe({
        next: () => {
          const vmInfo: HfMarkdownRenderContext['vmInfo'] = {};
          for (const [k, v] of this.vms) {
            vmInfo[k.toLowerCase()] = v;
          }
          this.mdContext = { vmInfo, session: this.session.id };
        },
        error: () => {
          this.sessionExpired = true;
          clearInterval(this.checkInterval);
        },
      });

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

  private buildVMSMapWithSharedVMs(entries: (readonly [string, VM])[]) {
    this.vms = new Map(entries);
    // Adding shared VMs to the vms map in order to render Tabs for their Webinterfaces.
    this.sharedVMs.forEach((svm) => {
      if (svm.name) {
        if (!this.vms.has(svm.name)) {
          this.vms.set(svm.name, svm);
        } else {
          this.vms.set('shared-' + svm.name, svm);
        }
      }
    });
  }

  private getWebinterfaces() {
    return Array.from<stepVM>(this.vms.values()).map((vm) =>
      this.vmService.getWebinterfaces(vm.id).pipe(
        map((res) => {
          const stringContent: string = atou(res.content);
          const services = JSON.parse(JSON.parse(stringContent)); // Consider revising double parse if possible
          services.forEach((service: Service) => {
            if (service.hasWebinterface) {
              const webinterface = {
                name: service.name ?? 'Service',
                port: service.port ?? 80,
                path: service.path ?? '/',
                hasOwnTab: !!service.hasOwnTab,
                hasWebinterface: true,
                disallowIFrame: !!service.disallowIFrame,
                active: false,
              };
              vm.webinterfaces
                ? vm.webinterfaces.push(webinterface)
                : (vm.webinterfaces = [webinterface]);
            }
          });
          return vm;
        }),
        catchError(() => {
          vm.webinterfaces = [];
          return of(vm);
        })
      )
    );
  }

  private getScenario(s: Session) {
    this.session = s;
    return this.scenarioService.get(s.scenario);
  }

  private getSharedVMNameFromEvent(sess: Session): Observable<Session> {
    return this.scheduledEventService.list().pipe(
      withLatestFrom(of(sess)),
      tap(([seList, sess]) => {
        seList
          .find((se) => se.access_code === sess.access_code)
          ?.shared_vms.forEach((vm) => {
            let matchingVM = this.sharedVMs.find((sVM) => sVM.id === vm.vm_id);
            matchingVM.name = vm.name;
          });
      }),
      switchMap(([se, sess]) => of(sess))
    );
  }

  private getSharedVMs(sess: Session): Observable<Session> {
    return this.vmService.getSharedVMs(sess.access_code).pipe(
      withLatestFrom(of(sess)),
      tap(([sVMs]) => {
        this.sharedVMs = sVMs;
      }),
      switchMap(([sVMs, sess]) => of(sess))
    );
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
      .get(this.session.user)
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

  showTerminalTab(vm: stepVM) {
    if (this.isUserSession && vm.vm_type == VirtualMachineTypeShared)
      return false; // Users do not see the Terminal of a shared VM
    return true;
  }

  setTabActive(webinterface: Service, vmName: string) {
    // Find our Webinterface and set it active, save currently active webinterface to set it unactive on change without having to iterate through all of them again.
    const webi = this.vms
      .get(vmName)
      ?.webinterfaces?.find((wi) => wi.name == webinterface.name);
    if (webi) {
      if (this.activeWebinterface) {
        this.activeWebinterface.active = false;
      }
      webi.active = true;
      this.activeWebinterface = webi;
    }
    // Find the corresponding clrTab and call activate on that. Background discussion on why this workaround has to be used can be found here: https://github.com/vmware-archive/clarity/issues/2112
    const tabLinkSelector = vmName + webinterface.name;
    setTimeout(() => {
      const tabLink = this.tabs
        .map((x) => x.tabLink)
        .find((x) => x.tabLinkId == tabLinkSelector);
      if (tabLink) tabLink.activate();
    }, 1);
  }

  reloadWebinterface(vmId: string, webinterface: Service) {
    this.reloadTabSubject.next({
      vmId: vmId,
      port: webinterface.port,
    } as webinterfaceTabIdentifier);
  }

  openWebinterfaceInNewTab(vm: stepVM, wi: Service) {
    // we always load our token synchronously from local storage
    // for symplicity we are using type assertion to string here, avoiding to handle promises we're not expecting
    const token = this.jwtHelper.tokenGetter() as string;
    const url: string =
      'https://' +
      vm.ws_endpoint +
      '/auth/' +
      token +
      '/p/' +
      vm.id +
      '/' +
      wi.port +
      wi.path;
    window.open(url, '_blank');
  }
}
