import { PrimaryGeneratedColumn, BaseEntity as ActiveRecord } from 'typeorm';

export default abstract class BaseEntity extends ActiveRecord {
	@PrimaryGeneratedColumn()
	id: number;
}
