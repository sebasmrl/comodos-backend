import { FileValidator } from "@nestjs/common";
import { IFile } from "@nestjs/common/pipes/file/interfaces";


export enum FileType {
  application = "application",
  image = "image",
  text = "text"
}

export enum FileSubtype {
  png = 'png',
  jpeg = "jpeg",
  jpg = "jpg",
  svg = "svg",
  svgXml = "svg+xml",
  pdf = 'pdf',
  docs = 'vnd.openxmlformats-officedocument.wordprocessingml.document',
  presentations = "vnd.openxmlformats-officedocument.presentationml.presentation",
  spreadsheets = "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  plain = 'plain',
  exe = "x-msdos-program",
  webp = "webp"
}


export default class AllowedFilesValidator extends FileValidator {

  constructor(protected readonly validationOptions: { "fileTypes": FileType[], "fileSubtypes": FileSubtype[], "sizeKb": number }) {
    super(validationOptions);
  }

  //protected validationOptions: Record<string, any>;
  isValid(files?: IFile): boolean | Promise<boolean> {

    const filesArrived: Express.Multer.File[][] = Object.values(files);
    const filteredFilesNumber = filesArrived.filter(fileArr => {
      const file = fileArr[0];
      const [_type, _subtype] = file.mimetype.split('/');

      return (
        this.validationOptions.fileTypes.includes(_type as FileType)
        && this.validationOptions.fileSubtypes.includes(_subtype as FileSubtype)
        && this.validationOptions.sizeKb > file.size
      ) ? true : false;
    }).length;

    return (filteredFilesNumber == filesArrived.length) ?true : false;
  
  }

  buildErrorMessage(file: any): string {
    return `Archivo no admitido, solo son admisibles los type:{ ${this.validationOptions.fileTypes} } con subtype:{ ${this.validationOptions.fileSubtypes} } y con peso maximo de: ${this.validationOptions.sizeKb} Kb,verifica nuevamente que tus archivos cumplan las restricciones`;
  }
}



