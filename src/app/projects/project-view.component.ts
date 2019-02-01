import { Component, Input } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { TaskModel } from '../tasks/task.model';
import { Subject } from 'rxjs/Subject';
import { Container } from '../shared/database.service';

@Component({
  selector: 'uapi-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss'],
  viewProviders: [DragulaService]
})
export class ProjectViewComponent {
  public readonly columns: Array<string> = ['New', 'Ready', 'In Progress', 'Review', 'Done', 'Archived'];
  @Input()
  public projectId: string;
  @Input()
  public projectName: string;

  @Container(`users/$uid$/tasks`)
  public tasks: Subject<Array<TaskModel>>;

  constructor(
    private dragulaService: DragulaService) {

    this.dragulaService.drag.subscribe((value: any) => {
      // console.log(`drag: ${value[0]}`); // value[0] will always be bag name
      this.onDrag(value.slice(1));
    });
    this.dragulaService.drop.subscribe((value: any) => {
      this.onDrop(value.slice(1));
      const [projectId, element] = value;
      const status = element.parentElement.dataset.column;
      const taskId = element.dataset.taskId;
      const partialPageUpdate = { 'id': taskId, 'status': status, 'projectId': projectId } as TaskModel;
      this.tasks.next([partialPageUpdate]);
    });
    this.dragulaService.over.subscribe((value: any) => {
      // console.log(`over: ${value[0]}`);
      this.onOver(value.slice(1));
    });
    this.dragulaService.out.subscribe((value: any) => {
      // console.log(`out: ${value[0]}`);
      this.onOut(value.slice(1));
    });
  }

  private hasClass(el: any, name: string): any {
    return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
  }

  private addClass(el: any, name: string): void {
    if (!this.hasClass(el, name)) {
      el.className = el.className ? [el.className, name].join(' ') : name;
    }
  }

  private removeClass(el: any, name: string): void {
    if (this.hasClass(el, name)) {
      el.className = el.className.replace(
        new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
    }
  }

  private onDrag(args: any): void {
    let [e] = args;
    this.removeClass(e, 'ex-moved');
  }

  private onDrop(args: any): void {
    let [e] = args;
    this.addClass(e, 'ex-moved');
  }

  private onOver(args: any): void {
    let [el, target] = args;
    this.addClass(el, 'ex-over');

    target.classList.add('possibleTargetContainer');
  }

  private onOut(args: any): void {
    let [el] = args;
    this.removeClass(el, 'ex-over');
  }
}
