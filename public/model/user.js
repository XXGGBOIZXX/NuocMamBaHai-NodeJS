export default class User{
  constructor(data) {
      Object.assign(this,data);
  }
  static async signIn(username, password) {
        let res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username, password: password })
        });
        let data = await res.json();
        if (!res.ok) {
          throw new Error(data);
        }
        return new User(data);
    }
  
  static async signUp(username, password, fullname, address, phone) {
    let res = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username:username,
        password:password,
        fullname:fullname, 
        address:address, 
        phone:phone })
    });
    let data = await res.json();
    if (!res.ok) {
      throw new Error(data);
    }
    return new User(data);
  }
  
  
  
}  
