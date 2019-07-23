import { ModalBuilderModel } from '../shared/form-builder/modal-builder/modal-builder.model';
import { FieldBuilderInterface } from '../shared/form-builder/field-builder/field-builder.interface';

export class ProjectModel extends ModalBuilderModel {
  public id?: string;
  public name?: string;
  public description?: string;
}

export const projectFields: FieldBuilderInterface[]  = [
  {
    type: 'text',
    name: 'name',
    label: 'Project Name',
    required: true
  },
  {
    type: 'text',
    name: 'description',
    label: 'Description'
  },
  {
    type: 'text',
    name: 'Mission',
    label: 'Mission Plan'
  },
  {
    type: 'dropdown',
    name: 'Location',
    label: 'Location',
    required: false,
    options: [
      { id: 'Charleston', name: 'Charleston' },
      { id: 'Goose Creek', name: 'Goose Creek' },
      { id: 'Daniel Island', name: 'Daniel Island' }
    ]
  },
  {
    type: 'hidden',
    name: 'id'
  }
];
