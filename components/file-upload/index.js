import React, { Component } from 'react';
import firebase from 'firebase';

class FileUpload extends Component {
  constructor() {
    super();
    this.handleUpload = this.handleUpload.bind(this)
    this.state = {
      uploadValue: 0,
      picture: null
    }
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
      this.setState({
        uploadValue: 100,
        picture: task.snapshot.downloadURL
      })
    })
  }

  render() {
    return(
      <div>
        <progress value={this.state.uploadValue} max="100"></progress>
        <br/>
        <input type="file" onChange={this.handleUpload}/>
        <br/>
        <img src="320" src={this.state.picture} alt=""/>
      </div>
    )
  }
}

export default FileUpload;
