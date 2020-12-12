export class SessionData{
    username: String = "";
    customer_id: number = 0;
    customer_name : String= "";
    businesskey : String = "";
    processInstanceID : String = "";
    actualTaskID : String = "";
    actualTaskName : String = "";
    actualTaskDefinitionKey : String = "";
    in_progress : boolean = false;

    public setUsername(pUsername: String){
        this.username = pUsername;
    }

    public getUsername(): String{
        return this.username;
    }
}