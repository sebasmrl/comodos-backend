export class StringModifiers{

    static toUpperCase(value:string, separator:string=' '){
         return value.trim().split(' ').filter( val => val.length>0).join(separator).toLocaleUpperCase();
     }
     
     static toLowerCase(value:string, separator=' '){
         return value.trim().split(' ').filter( val => val.length>0).join(separator).toLocaleLowerCase();
     } 
     
     static toUpperCamelCase(value:string, separator=' '){
         return value.trim().split(' ')
             .map( val=> `${val.slice(0,1).toLocaleUpperCase()}${val.slice(1,).toLocaleLowerCase()}`
             )
             .join(separator);
     }
 
     static toLowerCamelCase(value:string, separator=' '){
         return value.trim().split(' ')
             .map( val=> `${val.slice(0,1).toLocaleLowerCase()}${val.slice(1,).toLocaleUpperCase()}` )
             .join(separator);
     }
  
 } 