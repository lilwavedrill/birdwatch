import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Species } from '../species/species.entity';
import { Habitat } from '../habitats/habitat.entity';
import { Observation } from '../observations/observation.entity';
import { Favorite } from '../favorites/favorite.entity';

@Entity('birds')
export class Bird {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 500, nullable: true })
  imageUrl: string;

  @Column({ length: 50, nullable: true })
  conservationStatus: string;

  @Column({ type: 'float', nullable: true })
  wingspan: number;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @ManyToOne(() => Species, (species) => species.birds, { eager: true })
  @JoinColumn({ name: 'speciesId' })
  species: Species;

  @Column({ nullable: true })
  speciesId: number;

  @ManyToOne(() => Habitat, (habitat) => habitat.birds, { eager: true })
  @JoinColumn({ name: 'habitatId' })
  habitat: Habitat;

  @Column({ nullable: true })
  habitatId: number;

  @OneToMany(() => Observation, (obs) => obs.bird)
  observations: Observation[];

  @OneToMany(() => Favorite, (fav) => fav.bird)
  favorites: Favorite[];
}
