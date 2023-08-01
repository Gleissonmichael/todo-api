export class AccessToken {
    session: string;
    access: string;
  
    constructor(session: string, access: string) {
      this.session = session;
      this.access = access;
    }
  }
  