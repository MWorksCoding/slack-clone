

export class Threads {

    userMessage: string;
    userMessageDate: Date;
    userMessageTime: Date;
    userName: string;


    constructor(obj?: any){
        this.userMessage = obj ? obj.userMessage : '';
        this.userMessageDate = obj ? obj.userMessageDate : '';
        this.userMessageTime = obj ? obj.userMessageTime : '';
        this.userName = obj ? obj.userName : '';
    }

    public toJSON(){
        return{
            userMessage: this.userMessage,
            userMessageDate: this.userMessageDate,
            userMessageTime: this.userMessageTime,
            userName: this.userName,
        };
    }



}