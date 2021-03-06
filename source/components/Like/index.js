//Core
import React, { Component } from 'react';
import { func, string, shape, arrayOf } from 'prop-types';
import cx from 'classnames';

//Instruments
import Styles from './styles.m.css';

//Components
import { withProfile } from 'components/HOC/withProfile';

@withProfile
export default class Like extends Component {

  static propTypes = {
      _likePost: func.isRequired,
      id:        string.isRequired,
      likes:     arrayOf(
          shape({
              id:        string.isRequired,
              firstName: string.isRequired,
              lastName:  string.isRequired,
          }),
      ).isRequired,
  };

  state = {
      showLakers: false,
  }
  _showLakers = () => {
      this.setState({
          showLakers: true,
      });
  }

  _hideLakers = () => {
      this.setState({
          showLakers: false,
      });
  }

  _likePost = () => {
      const { _likePost, id } = this.props;

      _likePost(id);
  }

  _getLikedByMe = () => {
      const { currentUserFirstName, currentUserLastName, likes } = this.props;

      return likes.some(({ firstName, lastName }) => {
          return (
              `${firstName} ${lastName}` ===
              `${currentUserFirstName} ${currentUserLastName}`
          );
      });
  }

  _getLikeStyles = () => {
      const likedByMe = this._getLikedByMe();

      return cx(Styles.icon, {
          [Styles.liked]: likedByMe,
      });
  }

  _getLikersList = () => {
      const { showLakers } = this.state;
      const { likes } = this.props;

      const likesJSX = likes.map(({ firstName, lastName, id }) => (
          <li key = { id }>{`${firstName} ${lastName}`}</li>
      ));

      return likes.length && showLakers ? <ul>{likesJSX}</ul> : null;
  }
  _getLikesDescription = () => {
      const { likes, currentUserLastName, currentUserFirstName } = this.props;

      const likedByMe = this._getLikedByMe();

      if (likes.length === 1 && likedByMe) {
          return `${currentUserFirstName} ${currentUserLastName}`;
      } else if (likes.length === 2 && likedByMe) {
          return `You and ${likes.length - 1} other`;
      } else if (likedByMe) {
          return `You and ${likes.length - 1} others`;
      }

      return likes.length;
  }

  render () {
      const likeStyles = this._getLikeStyles();
      const likersList = this._getLikersList();
      const likesDescription = this._getLikesDescription();

      return (
          <section className = { Styles.like } >
              <span className = { likeStyles } onClick = { this._likePost } >
                Like
              </span>
              <div>
                  { likersList }
                  <span
                      onMouseEnter = { this._showLakers }
                      onMouseLeave = { this._hideLakers }>
                      {likesDescription}
                  </span>
              </div>

          </section>
      );
  }
}
