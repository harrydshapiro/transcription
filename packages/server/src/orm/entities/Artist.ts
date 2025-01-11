import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Album } from "./Album";
import { Genre } from "./Genre";
import { Track } from "./Track";
import { AuditableEntity } from "./AuditableEntity";

@Entity("artists", { schema: "public" })
export class Artist extends AuditableEntity<Artist> {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("character varying", { name: "uri", unique: true })
  uri!: string;

  @Column("integer", { name: "followers", nullable: true })
  followers?: number;

  @Column("jsonb", { name: "images", default: [] })
  images!: { url: string; height: number; width: number }[];

  @Column("character varying", { name: "name" })
  name!: string;

  @Column("integer", { name: "popularity", nullable: true })
  popularity?: number;

  @ManyToMany(() => Album)
  @JoinTable({
    name: "albums_artists",
    joinColumn: {
      name: "artist_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "album_id",
      referencedColumnName: "id",
    },
  })
  albums!: Album[];

  @ManyToMany(() => Genre)
  @JoinTable({
    name: "artists_genres",
    joinColumn: {
      name: "artist_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "genre_id",
      referencedColumnName: "id",
    },
  })
  genres!: Genre[];

  @ManyToMany(() => Track)
  @JoinTable({
    name: "artists_tracks",
    joinColumn: {
      name: "artist_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "track_id",
      referencedColumnName: "id",
    },
  })
  tracks!: Track[];
}

export type IArtist = InstanceType<typeof Artist>;
