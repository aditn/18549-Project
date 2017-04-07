// Dependencies
import React from 'react';
import Reflux from 'reflux';

import MessageStore from '../reflux-stores/messageStore.js';
import NotificationSystem from 'react-notification-system';

const GlobalMessage = React.createClass({
  mixins: [Reflux.ListenerMixin],
  _notificationSystem : null,
  onNewMessage(obj){
    this._notificationSystem.addNotification({
      message: obj.msg,
      level: obj.type,
      autoDismiss: 5,
      // position : 'tr'
      position: 'bl'
    });
  },
  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem;
    this.listenTo(MessageStore,'onNewMessage');
  },
  render() {
    return (
      <NotificationSystem ref="notificationSystem"/>
    );
  }
});

export default GlobalMessage;
