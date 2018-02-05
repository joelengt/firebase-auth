import React, { Component } from 'react';
import firebase from 'firebase';

class FileUpload extends Component {
  constructor() {
    super();
    this.state = {
      picture: []
    }
  }

  /** Get url file by directly reference */
  componentWillMount() {
    const storage = firebase.storage();
    const pathReference = storage.ref('images/14211958_1368660459815210_2127538593929405648_n.jpg')
      .getDownloadURL()
      .then((url) => {
        console.log('File url', url)
        
        this.setState({
          picture: url
        })

      }).catch((error) => {
        // Handle any errors
        console.log('Error al descargar file')
      })
  }

  render() {
    return(
      <div>
      </div>
    )
  }
}

export default FileUpload;
