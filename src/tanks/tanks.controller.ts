import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TanksService } from './tanks.service';
import { Tank } from './tanks.entity';
import {
  Crud,
  CrudAuth,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const fs = require('fs');

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

  get base(): CrudController<Tank> {
    return this;
  }


  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    let tank = null;
    try {
      tank = await this.service.getOne(req);
    } catch (e) {
      throw e;
    }
    if (tank.avatar) {
      if (fs.existsSync(tank.avatar)) fs.unlinkSync(tank.avatar);
    }
    return this.base.deleteOneBase(req);
  }

  @UseInterceptors(CrudRequestInterceptor, FileInterceptor('file',
    {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|heic)$/)) {
          cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }else{
          cb(null, true);
        }
      },
      storage: diskStorage({
        destination: 'uploads/tanks/avatars',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    },
    ),
  )
  @Patch(':id/avatars')
  async uploadImage(@ParsedRequest() req: CrudRequest, @UploadedFile() file) {
    let tank = null;
    try {
      tank = await this.service.getOne(req);
    } catch (e) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      throw e;
    }
    if (tank.avatar) {
      if (fs.existsSync(tank.avatar)) fs.unlinkSync(tank.avatar);
    }
    tank.avatar = file.path;
    await this.service.persistTank(tank);
    return tank
  }

  @UseInterceptors(CrudRequestInterceptor)
  @Get(':id/avatars')
  async serveAvatar(@ParsedRequest() req: CrudRequest, @Res() res): Promise<any> {
    let tank = null;
    try {
      tank = await this.service.getOne(req);
    } catch (e) {
      throw e;
    }
    return res.sendFile(tank.avatar, { root: 'uploads/..' });
  }
}
