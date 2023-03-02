export class Channel {

    channelName: string;
    description: string;
    thread: string;
  id: string | undefined;

    constructor(obj?: any){
        this.channelName = obj ? obj.channelName : '';
        this.description = obj ? obj.description : '';
        this.thread = obj ? obj.thread : '';
    }

    public toJSON(){
        return{
            channelName: this.channelName,
            description: this.description,
            thread: this.thread,
        };
    }
}