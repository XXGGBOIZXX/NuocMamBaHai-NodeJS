
export default class User{
    constructor(data) {
        Object.assign(this,data);
    }
    static async signIn(username, password) {
        try {
          const res = await fetch('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uName: username, pw: password }),
          });
    
          if (!res.ok) {
            throw new Error(`Login failed with status: ${res.status}`);
          }
    
          const data = await res.json();
          return new User(data);
        } catch (error) {
          console.error('SignIn error:', error);
          throw error; // Re-throw the error for handling in the calling code
        }
      }
    
      static async signUp(username, password, fullName, adr, num) {
        try {
          const res = await fetch('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uName: username, pw: password, fullName:fullName, adr:adr, num:num }),
          });
          if (!res.ok) {
            throw new Error(`Signup failed with status: ${res.status}`);
          }
          const data = await res.json();
          return new User(data);
        } catch (error) {
          console.error('SignUp error:', error);
          throw error; // Re-throw the error for handling in the calling code
        }
      }
    
}  
