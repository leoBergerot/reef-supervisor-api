import { Controller, ForbiddenException, Request, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { Measure } from './measures.entity';
import { MeasuresService } from './measures.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Crud({
    model: {
      type: Measure,
    },
    routes: {
      only: ['getOneBase', 'updateOneBase', 'getManyBase', 'deleteOneBase', 'createOneBase'],
    },
  },
)
@CrudAuth({
  filter: (req) => {
    const tankFilter = req.query.tank ? { '$eq': req.query.tank } : {};
    const typeFilter = req.query.type ? { type: { '$eq': req.query.type } } : {};

    const filters = {
      tank: {
        '$in': req.user.tanks.map((value) => value.id),
      },
    };

    Object.assign(filters.tank, tankFilter);
    Object.assign(filters, typeFilter);
    return (
      filters
    );
  },
})
@Controller('measures')
export class MeasuresController implements CrudController<Measure> {
  constructor(public service: MeasuresService) {
  }

  get base(): CrudController<Measure> {
    return this;
  }

  @Override()
  createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Measure,
    @Request() request,
  ) {
    if (request.user.tanks.map((value) => value.id).includes(dto.tank)) {
      return this.base.createOneBase(req, dto);
    }
    throw new ForbiddenException('You can create measure only for your tank');
  }

  @Override('updateOneBase')
  updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Measure,
    @Request() request,
  ) {
    if (!dto.tank) {
      return this.base.updateOneBase(req, dto);
    } else if (request.user.tanks.map((value) => value.id).includes(dto.tank)) {
      return this.base.updateOneBase(req, dto);
    }
    throw new ForbiddenException('You can create measure only for your tank');
  }
}
