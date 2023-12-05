interface Worker {
  name: string;
  dni: string;
  year: number;
  month: number;
  tareos: Tareos[]
}

interface Tareos {
  dia: number,
  estado?: string,
  note?: string
}

export {
  Worker,
  Tareos
}