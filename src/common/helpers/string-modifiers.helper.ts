
export class StringModifiers{

   static toUpperCase(value:string){
        return value.split(' ').filter( val => val.length>0).join(' ').toLocaleUpperCase();
    }
    
    static toLowerCase(value:string){
        return value.split(' ').filter( val => val.length>0).join(' ').toLocaleLowerCase();
    } 
    
    static toUpperCamelCase(value:string){
        return value.split(' ')
            .map( val=> `${val.slice(0,1).toLocaleUpperCase()}${val.slice(1,).toLocaleLowerCase()}`
            )
            .join(' ');
    }

    static toLowerCamelCase(value:string){
        return value.split(' ')
            .map( val=> `${val.slice(0,1).toLocaleLowerCase()}${val.slice(1,).toLocaleUpperCase()}` )
            .join(' ');
    }
 
} 