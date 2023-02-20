export class ChatUser {

    name: string;

    constructor(obj?: any){
        this.name = obj ? obj.name : '';

    }

    public toJSON(){
        return{
            name: this.name,

        };
    }
}