export class Channel {

    channelName: string;
    description: string;

    constructor(obj?: any){
        this.channelName = obj ? obj.channelName : '';
        this.description = obj ? obj.description : '';
    }

    public toJSON(){
        return{
            channelName: this.channelName,
            description: this.description,
        };
    }
}