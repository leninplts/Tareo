interface Worker {
  id: number;
  name: string;
  dni: string;
  tareos: Tareo[];
}

interface Tareo {
  id: number;
  year: number;
  month: number;
  tareo: ITareo[];
}

interface ITareo {
  day: number;
  state?: string;
  note?: string;
  iWeekDay?: number;
  week?: string;
}

export { Worker, Tareo, ITareo };
