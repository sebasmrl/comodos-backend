import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";

export const  handleDbErrors= (logger:Logger, e:any):never =>{
    logger.error(`${e.detail}`);
    if(e.code === '23505') 
      throw new BadRequestException(`Error al tratar de crear un Usuario: ${e.detail}`);

    throw new InternalServerErrorException('Contacte con el admin para más información');

  }