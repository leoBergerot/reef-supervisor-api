import { Controller, UseGuards } from '@nestjs/common';
import { TanksService } from './tanks.service';
import { Tank } from './tanks.entity';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Crud({
    model: {
      type: Tank,
    },
    routes: {
      only: ['getOneBase', 'updateOneBase', 'getManyBase', 'deleteOneBase', 'createOneBase'],
    },
  },
)
@CrudAuth({
  property: 'user',
  filter: (user) => (
    {
      user: user.id,
    }
  ),
  persist: (user) => {
    return { user: user.id };
  },
})

@Controller('tanks')
export class TanksController implements CrudController<Tank> {
  constructor(public service: TanksService) {
  }
}
