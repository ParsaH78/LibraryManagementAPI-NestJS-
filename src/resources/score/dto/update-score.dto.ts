import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateScoreDto } from './create-score.dto';

export class UpdateScoreDto extends PartialType(
  OmitType(CreateScoreDto, ['book_id' as const]),
) {}
