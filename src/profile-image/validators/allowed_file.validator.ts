import { FileValidator } from "@nestjs/common";
import { IFile } from "@nestjs/common/pipes/file/interfaces";


export enum FileType{
  application="application",
  image="image",
  text="text"
}

export enum FileSubtype{
  png='png',
  jpeg="jpeg",
  jpg="jpg",
  svg="svg",
  svgXml="svg+xml",
  pdf='pdf',
  docs='vnd.openxmlformats-officedocument.wordprocessingml.document',
  presentations="vnd.openxmlformats-officedocument.presentationml.presentation",
  spreadsheets="vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  plain='plain',
  exe="x-msdos-program"
}


 export default class AllowedFileValidator extends FileValidator{

    constructor(protected readonly validationOptions:{"fileTypes":FileType[], "fileSubtypes":FileSubtype[], "sizeKb":number}){
        super(validationOptions);
    }
    
     //protected validationOptions: Record<string, any>;
     isValid(file?: IFile): boolean | Promise<boolean> {
        const [_type,_subtype ] = file.mimetype.toLowerCase().split('/');

        return (
            this.validationOptions.fileTypes.includes(_type as FileType) 
                && this.validationOptions.fileSubtypes.includes(_subtype as FileSubtype)
                && this.validationOptions.sizeKb > file.size  
        ) ? true : false;
     }
     buildErrorMessage(file: any): string {
         return `Archivo no admitido, solo son admisibles los type:{ ${this.validationOptions.fileTypes} } con subtype:{ ${this.validationOptions.fileSubtypes} } y peso maximo de: ${this.validationOptions.sizeKb} Kb `;
 }
 }
