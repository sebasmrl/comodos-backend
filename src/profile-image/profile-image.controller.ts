import { Controller, Get, Post, UseInterceptors, UploadedFile, ParseFilePipe, Param, ParseUUIDPipe, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import AllowedFileValidator, { FileSubtype, FileType } from './validators/allowed_file.validator';
import { User } from 'src/user/entities/user.entity';
import { ProfileImageService } from './profile-image.service';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('user-images')
export class ProfileImageController {
  constructor(private readonly profileImageService: ProfileImageService) { }


  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string){
    return await this.profileImageService.findOne(id);
  }


  @Auth()
  @Post()
  @UseInterceptors(FileInterceptor('profile_image'))
  async createOrUpdateUserImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new AllowedFileValidator({
            fileTypes: [FileType.image],
            fileSubtypes: [FileSubtype.jpeg, FileSubtype.png, FileSubtype.jpg],
            sizeKb: 2000000  //2MB
          })
        ]
      })
    ) file: Express.Multer.File,
    @Req() req:Request ,
  ) {
    const userLogued:User = req['user']
    const profileImage = await  this.profileImageService.createOrUpdate(file, userLogued );
    return profileImage;
  }

  @Auth()
  @Get(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string){
    return await this.profileImageService.remove(id);
  }

}



  /*  //example with pipes validation
    @Post()
    @UseInterceptors(FileInterceptor('profile_image'))
    create(
      @UploadedFile(new FileSizePipe()) file: Express.Multer.File
    ) {
      console.log(file);
      const { buffer, ...result } = file;
      return result;
    } 
    */

