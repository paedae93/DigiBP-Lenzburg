export class SessionData{
    username: String = "";
    customer_id: number = 0;
    customer_name : String= "";
    businesskey : String = "";
    processInstanceID : String = "";
    actualTaskID : String = "";
    actualTaskName : String = "";
    actualTaskDefinitionKey : String = "";
    password : String | undefined;

    //Loader
    in_progress : boolean = false;
    status : String = "";
    overlay : String = "";

    public setUsername(pUsername: String){
        this.username = pUsername;
    }

    public getUsername(): String{
        return this.username;
    }
}