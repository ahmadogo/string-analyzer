import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('analyzed_strings')
export class AnalyzedString {
  @PrimaryColumn()
  id: string; // SHA256 hash, used as unique ID

  @Column({ unique: true })
  value: string;

  @Column('jsonb')
  properties: {
    length: number;
    is_palindrome: boolean;
    unique_characters: number;
    word_count: number;
    sha256_hash: string;
    character_frequency_map: Record<string, number>;
  };

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
