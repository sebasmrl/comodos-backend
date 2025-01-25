import { Controller, Get, Post,Param,  ParseUUIDPipe, UseInterceptors, ParseFilePipe, UploadedFiles, Delete, Req } from '@nestjs/common';
import { FileFieldsInterceptor} from '@nestjs/platform-express';
import { AdImageService } from './ad-image.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import AllowedFilesValidator, { FileSubtype, FileType } from './validators/allowed_file.validator';
import { User } from 'src/user/entities/user.entity';

@Controller('ad-images')
export class AdImageController {
  constructor(private readonly adImageService: AdImageService) { }


  @Get(':id')
  async findMainAdImage(@Param('id', ParseUUIDPipe) id: string) {
    return await this.adImageService.findMainAdImage(id);
  }

  //finAll se descarta por cuanto es informacion que debe administrar findOne en AdController

  @Auth()
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'main', maxCount: 1 },
      { name: 'ad_image_1', maxCount: 1, },
      { name: 'ad_image_2', maxCount: 1 },
      { name: 'ad_image_3', maxCount: 1 },
      { name: 'ad_image_4', maxCount: 1 },
      { name: 'ad_image_5', maxCount: 1 },
      { name: 'ad_image_6', maxCount: 1 },
    ], {
      limits: { fields: 7, }//fileSize: 3000000 },
    })
  )
  async createOrUpdateAdImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new AllowedFilesValidator({
            fileTypes: [FileType.image],
            fileSubtypes: [FileSubtype.jpeg, FileSubtype.png, FileSubtype.jpg],
            sizeKb: 2000000  //3MB
          })
        ]
      })
    ) files: {   //es un arreglo porque contiene la metadata de cada 1
      main?: Express.Multer.File[],
      ad_image_1?: Express.Multer.File[],
      ad_image_2?: Express.Multer.File[],
      ad_image_3?: Express.Multer.File[],
      ad_image_4?: Express.Multer.File[],
      ad_image_5?: Express.Multer.File[],
      ad_image_6?: Express.Multer.File[],
    },
    @Req() req:Request
  ) {
    const filesRefactor = Object.values(files).map((file) => file[0]);
    const user:User = req['user'];
    return await this.adImageService.createOrUpdate(filesRefactor, user)
  }

  //TODO: Realizar metodo delete para multiples imagenes (maximo 7) requiriendo solamente los id's

  @Auth()
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string, @Req() req:Request) {
    const user:User = req['user'];
    return await this.adImageService.remove(id, user);
  }



  /*  // backup sobre forma de captura archivos multiples en un solo field
  @Post('uploads/one-field')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  } 
*/
}
