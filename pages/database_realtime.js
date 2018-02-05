import React from 'react'
import Layout from '../components/Layout'
import FruitList from '../components/fruits'
import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyDBI1ii3abJ6-RIX5ZTzAHtXuTQ9NglAVE",
  authDomain: "cromlu-auth.firebaseapp.com",
  databaseURL: "https://cromlu-auth.firebaseio.com",
  projectId: "cromlu-auth",
  storageBucket: "",
  messagingSenderId: "349796700184"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

/** 
 * Firebase-Login Google
 * */
class RealTimeStore extends React.Component {
  constructor() {
    super()
    this.handleAuthFacebook = this.handleAuthFacebook.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.renderLoginButton = this.renderLoginButton.bind(this);

    this.state = {
      user: null,
      pictures: []
    }
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user })
    })

    firebase.database().ref('pictures').child('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
       })
    })
  }

  // Event click to Google Auth
  handleAuthFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider()

    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        return console.log(`${result.user.email} login`)
      })
      .catch((error) => {
        return console.log(`Error ${error.code}: ${error.message}`)
      })
  }

  // Event click to Google LogOut
  handleLogOut() {
    firebase.auth().signOut()
      .then(result => console.log(`${result.user.email} your are logout`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`))
  }

  renderLoginButton() {
    // If user is logged
    if (this.state.user) {
      return (
        <div>
          <img src={this.state.user.photoURL} alt={this.state.user.displayName}/>
          <p>Hola { this.state.user.displayName }!</p>
          <button onClick={ this.handleLogOut }>Salir</button>

          <div>
            {
              this.state.pictures.map(picture => (
                <div>
                  <img src={picture.url} alt=""/>
                  <p>{picture.name}</p>
                </div>
              ))
            }
          </div>
        </div>
      )
    }
    
    // If user is logout
    return (
      <button onClick={ this.handleAuthFacebook }> Login with Facebook </button>
    )
  }

  render() {
    return(
      <div>
        Welcome!
        <div>
        { this.renderLoginButton() }
        </div>
      </div>
    )
  }
}

export default RealTimeStore
