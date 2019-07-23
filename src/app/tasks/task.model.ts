import { ModalBuilderModel } from '../shared/form-builder/modal-builder/modal-builder.model';
import { FieldBuilderInterface } from '../shared/form-builder/field-builder/field-builder.interface';

export class TaskModel extends ModalBuilderModel {
  public id?: string;
  public projectId?: string;
  public name: string;
  public status: string;
  public person: string;
  public description: string;
  public tags: Array<string>;
  public blocked: boolean;
  public blockedDescription: string;
  public teamRequirement: boolean;
  public clientRequirement: boolean;

  public points: Array<PointsModel>;
}
export class PointsModel {
  public name: string;
  public value: number;
}

export const taskSchematics: FieldBuilderInterface[] = [
  {
    type: 'hidden',
    name: 'id'
  },
  {
    type: 'dropdown',
    name: 'project',
    label: 'Project',
    required: true,
    container: 'users/projects'
  },
  {
    type: 'dropdown',
    name: 'status',
    label: 'Status',
    required: true,
    options: [
      { id: 'New', name: 'New' },
      { id: 'Ready', name: 'Ready' },
      { id: 'In Progress', name: 'In Progress' },
      { id: 'Review', name: 'Review' },
      { id: 'Done', name: 'Done' },
      { id: 'Archived', name: 'Archived' }
    ]
  },
  {
    type: 'text',
    name: 'person',
    label: 'Person'
  },
  {
    type: 'text',
    name: 'name',
    label: 'Name'
  },
  {
    type: 'text',
    name: 'description',
    label: 'Description',
    placeholder: '',
    multiline: true
  }
];

  /*

*/
