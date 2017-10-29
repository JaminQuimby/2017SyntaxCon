export class TaskModel {
  public id?: string;
  public projectId?: string;
  public name: string;
  public status: string;
  public person: string;
  public description: string;
  public tags: Array<string>;

  public teamRequirement: boolean;
  public clientRequirement: boolean;
  public blocked: boolean;
  public blockedDescription: string;
  public points: Array<PointsModel>;
}

export class PointsModel {
  public name: string;
  public value: number;
}
