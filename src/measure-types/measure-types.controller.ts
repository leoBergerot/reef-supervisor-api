import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Crud, CrudController } from '@nestjsx/crud';
import { Measure } from '../measures/measures.entity';
import { MeasureType } from './measure-types.entity';
import { MeasureTypesService } from './measure-types.service';

@UseGuards(JwtAuthGuard)
@Crud({
    model: {
      type: Measure,
    },
    routes: {
      only: ['getManyBase'],
    },
  },
)
@Controller('measure-types')
export class MeasureTypesController implements CrudController<MeasureType> {
  constructor(public service: MeasureTypesService) {
  }
}
