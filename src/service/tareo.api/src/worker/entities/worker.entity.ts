import { Tareo } from 'src/tareo/entities/tareo.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Worker {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 100, nullable: true })
  name: string;

  @Column({ length: 8, nullable: false })
  dni: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Tareo, (tareo) => tareo.worker, { eager: true })
  tareos: Tareo[];
}
