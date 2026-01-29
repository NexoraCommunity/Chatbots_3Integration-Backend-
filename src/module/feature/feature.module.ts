import { Global, Module } from '@nestjs/common';
import { FeatureService } from './service/feature.service';
import { FeatureController } from './feature.controller';

@Module({
  imports: [],
  controllers: [FeatureController],
  providers: [FeatureService],
})
export class FeatureModule {}
