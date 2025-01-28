import { Controller, Get, Post, UseInterceptors, UploadedFile, ParseFilePipe, Param, ParseUUIDPipe, Req, Res, Header, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/entities/user.entity';
import { ProfileImageService } from './profile-image.service';
import AllowedFileValidator, { FileSubtype, FileType } from './validators/allowed_file.validator';

@Controller('user-images')
export class ProfileImageController {
  constructor(private readonly profileImageService: ProfileImageService) { }


  //@Header('Content-Type', 'application/octet-stream')
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string){
    const imageUrl = await this.profileImageService.findOneProfileImageUrl(id);
    return imageUrl;
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
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string, @Req() req:Request ,){
    const userLogued:User = req['user']
    return await this.profileImageService.remove(id, userLogued);
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

