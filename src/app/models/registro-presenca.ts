export interface RegistroPresenca {
  id: number;
  nome: string;
  idade?: number;
  dataHoraRegistro: Date;
  presencaConfirmada: boolean;
}
