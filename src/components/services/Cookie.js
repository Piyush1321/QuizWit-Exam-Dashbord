import Flash from '../services/Flash';

class Cookie {

  create(cn, cv, e) {
    let days = e*24*60*60*1000;
    const d = new Date();
    d.setTime(d.getTime() + days);
    let str = cn + "=" + cv + "; expires=" + d.toUTCString() + "; path=/";
    return str;
  }

  // expiresAfter time in days
  set(cookieName, cookieValue, expiresAfter) {
    try {
      document.cookie = this.create(cookieName, cookieValue, expiresAfter);
      return true;
    } catch(e){
      Flash.message(e);
    }
  }

  get(cookieName) {
    let decodedCookie = decodeURIComponent(document.cookie);
    decodedCookie = decodedCookie.trim();
    let cookies = decodedCookie.split(';');
    let value = '';
    cookies.forEach((c) => {
      if(c) {
        c = c.trim();
        let [cn, cv] = c.split('=');
        if(cn == cookieName) {
          value = cv;
          return;
        }
      }
    })
    return value;
  }

  delete(cookieName) {
    this.set(cookieName, '', -1);
  }
}

export default new Cookie();