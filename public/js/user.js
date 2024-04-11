
export default class User{
    constructor(data) {
        Object.assign(this,data);
        this.uri=`/users/${this.uName}`;
    }
    static async signIn(){

    }
    static async signUp(){
      
    }
}  