import React from 'react'
import Layout from '../components/Layout'
import FruitList from '../components/fruits'
import firebase from 'firebase'
import FileUpdate from '../components/file-upload2'

var config = {
  apiKey: "AIzaSyDBI1ii3abJ6-RIX5ZTzAHtXuTQ9NglAVE",
  authDomain: "cromlu-auth.firebaseapp.com",
  databaseURL: "https://cromlu-auth.firebaseio.com",
  projectId: "cromlu-auth",
  storageBucket: "gs://cromlu-auth.appspot.com/",
  messagingSenderId: "349796700184"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

/** 
 * Firebase-Login Google
 * */
class Instagram extends React.Component {
  constructor() {
    super()
    this.handleAuthFacebook = this.handleAuthFacebook.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.renderLoginButton = this.renderLoginButton.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.deleteElement = this.deleteElement.bind(this);

    this.state = {
      user: null,
      pictures: []
    }
  }

  componentWillMount() {
    // verify if user is Auth
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user })
    })

    // Get a list from store
    firebase.database().ref('pictures')
    .on('child_added', (snapshot, prevChildKey) => {
      let element = snapshot.val() || {}

      // id from firebase
      element.id = snapshot.key

      this.setState({
        pictures: this.state.pictures.concat(element)
      })
    })

    // get a simple value
    let imageID = '-L4Yc5UuPh-o4I1MhQi9'
    firebase.database().ref('pictures/' + imageID)
    .on('child_added', snapshot => {
      // snapshot.val().image
      console.log(`Items data => ${snapshot.key}`)
    }, (error) => {
      console.log('Error', error)
    })

    // databaseRef
    // .child('videos')
    // .children(["23423lkj234", "20982lkjbba"])
    // .on('value', snapshot => snapshot.val())

    // get a single value
    firebase.database().ref('text')
    .on('value', snapshot => {
      console.log('single value text =>', snapshot.val())
    }, (error) => {
      console.log('Error', error)
    })

    // Delete all elements in the list by a equal uuid or attribute
    // const ref = firebase.database().ref('pictures')
    // ref.orderByChild('displayName').equalTo('Joel Gonzales Tipismana')
    //   .once('value').then(snapshot => {
    //     snapshot.forEach(childSnapshot => {
    //     //remove each child
    //     ref.child(childSnapshot.key).remove();
    //   });
    // });

    // Remove a element in a list by id
    // firebase.database().ref('pictures').child('-L4Z-d04d7U41GOhRew-').remove()

    firebase.database().ref('pictures').on('child_removed', (oldChildSnapshot) => {
      console.log('Child '+ oldChildSnapshot.key +' was removed');
    });

    // Delete a simple reference
    firebase.database().ref('text')
    .remove((error) => {
      console.log(error ? "Uh oh!" : "Success!");
    })

    // Update -> https://stackoverflow.com/questions/40589397/firebase-db-how-to-update-particular-value-of-child-in-firebase-database
    // db.ref("-Users/-KUanJA9egwmPsJCxXpv").update({ displayName: "New trainer" });
    
    firebase.database().ref('pictures/-L4Z3qmSdxdC1b83ELcB').update({ displayName: "Joel" })

    // var db = firebase.database();
    // db.ref("-Users/-KUanJA9egwmPsJCxXpv/displayName").set("New trainer");

    // Update by a custom uuid or other attribute
    // var query = firebase.database().ref('pictures').orderByKey("uid").equalTo("jRXMsNZHR2exqifnR2rXcceEMxF2");
    // query.once("child_added", function(snapshot) {
    //   snapshot.ref.update({ displayName: "New trainer" })
    // });


    // to turn off the firebase listener
    // ref.off(‘some_event’, callback);

    // to call firebase listener as once
    // ref.once(‘value’, callback);


    // query reference -> https://howtofirebase.com/save-and-query-firebase-data-ed73fb8c6e3a
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

  handleUpload(event) {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/images/${file.name}`);
    const task = storageRef.put(file);

    task.on('state_changed', snapshot => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      this.setState({
        uploadValue: percentage
      })
    }, error => {
      console.log('Error =>', error.message)
    }, () => {
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL
      }

      const dbRef = firebase.database().ref('pictures');
      const newPicture = dbRef.push();
      newPicture.set(record)

    })
  }

  deleteElement(pictureID) {
    console.log('Clicked!')
    // Remove a element in a list by id
    firebase.database().ref('pictures').child(pictureID).remove()
  }

  renderLoginButton() {
    // If user is logged
    if (this.state.user) {
      return (
        <div>
          <img src={this.state.user.photoURL} alt={this.state.user.displayName}/>
          <p>Hola { this.state.user.displayName }!</p>
          <button onClick={ this.handleLogOut }>Salir</button>

          <FileUpdate onUpload={ this.handleUpload }/>
          
          {
            this.state.pictures.map((picture, index) => (
              <div id={picture.id} key={index}>
                <img src={picture.image}/>
                <br/>
                <img src={picture.photoURL} alt={picture.displayName}/>
                <br/>
                <span>{picture.displayName}</span>
              </div>
            ))
          }

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

export default Instagram
