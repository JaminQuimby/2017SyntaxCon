import { Component, Input } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { TasksService } from '../tasks/tasks.service';
import { TaskModel } from '../tasks/task.model';
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

  public tasks: Array<TaskModel> = [];

  constructor(
    private dragulaService: DragulaService,
    private service: TasksService) {
    this.service.task$.subscribe(tasks => {
      if (tasks.length >= 1) { this.tasks = tasks; }
    });

    this.dragulaService.drag.subscribe((value: any) => {
      // console.log(`drag: ${value[0]}`); // value[0] will always be bag name
      this.onDrag(value.slice(1));
    });
    this.dragulaService.drop.subscribe((value: any) => {
      // console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
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
    let [el] = args;
    this.addClass(el, 'ex-over');
  }

  private onOut(args: any): void {
    let [el] = args;
    this.removeClass(el, 'ex-over');
  }
}
