export class Chat {

    chatUsers: [{
        name: string;
    }];
    messages2: [
        {message: string;
        time: any;
        author: string;}
        ];

    constructor(obj?: any){
        this.chatUsers = obj ? obj.chatroomUsers : '';
        this.messages2 = obj ? obj.messages : '';
    }

    public toJSON(){
        return{
            chatroomUsers: this.chatUsers,
            messages: this.messages2
        };
    }
}