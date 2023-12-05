import { Worker } from 'src/worker/entities/worker.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tareo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: number;

  @Column()
  month: number;

  @Column({ type: 'text', nullable: true })
  tareo: string;

  @ManyToOne(() => Worker, (worker) => worker.tareos)
  worker: Worker;
}
