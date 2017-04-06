// Reflux!
import Reflux from 'reflux';
// The actoins
import ControlActions from '../reflux-actions/controlActions';

const MessageStore = Reflux.createStore({
  listenables: [ControlActions],
  onSendMessage(msg,type){
    if(type == undefined){
      type = 'info';
    }
    this.trigger({msg,type});
  }
});

export default MessageStore;
