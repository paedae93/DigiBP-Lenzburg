export class SessionData{
    username: String = "";
    businesskey : String = "";
    processInstanceID : String = "";
    actualTaskID : String = "";
    actualTaskName : String = "";
    actualTaskDefinitionKey : String = "";

    public setUsername(pUsername: String){
        this.username = pUsername;
    }

    public getUsername(): String{
        return this.username;
    }
}