export class CreateAbstimmungDto {
  id?: number;
  name: string;
  startDate: string;
  endDate: string;

  constructor(name: string, startDate: Date, endDate: Date, id?: number) {
    this.id = id;
    this.name = name;
    this.startDate = startDate.toISOString();
    this.endDate = endDate.toISOString();
  }
}
