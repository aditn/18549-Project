import Reflux from 'reflux';
import docCookies from './cookie.js';

// As for now, I assume token is stored in cookie
const Auth = Reflux.createStore({
  data: {
    tokenName: 'maihoo-token',
    token: undefined,
    expire: 70000
  },
  init() {},
  getToken(token) {
    if (token !== undefined && token !== null) {
      docCookies.setItem(this.data.tokenName, token);
    }
    const temp = docCookies.getItem(this.data.tokenName);
    if (temp !== undefined && temp !== null) {
      this.data.token = temp;
    }
    this.emit();
    return this.data.token;
  },
  validateToken(token) {
    if (typeof(token) !== 'string') {
      return false;
    }
    return true;
  },
  authenticateToken(token) {
    // docCookies.setItem(this.tokenName,'1ee6a4b4-42b3-4587-a127-582f6850078d');
    const test = this.getToken(token);
    return this.validateToken(test);
  },
  refreshToken() {
    return this.token;
  },
  emit() {
    this.trigger(this.data);
  }
});

export default Auth;
