import React from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

function Profile({navigation}){
  
  Profile.propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func.isRequired,
    }).isRequired,
  };

  const github_username = navigation.getParam('github_username');
  return <WebView style={flex1} source={{uri: `https://github.com/${github_username}`}}/>;
}

const flex1 = { flex : 1};

export default Profile;