import { IState } from "../interfaces/states.inteface";

const statesDictionary: {[key: string]: IState} = {
  DL: { id: 1, color: '#24fc077e', description: 'Dia laborado' } as IState,
  FJ: { id: 2, color: '#5bf4ffa6', description: 'Falta justificada'} as IState,
  FI: { id: 3, color: '#ff5b5ba6', description: 'Falta injustificada'} as IState,
  DD: { id: 4, color: '#fcff42cb', description: 'Descanso'} as IState,
}

export {
  statesDictionary
}