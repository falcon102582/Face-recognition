import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ParticlesBg from 'particles-bg';
import 'tachyons';
import './App.css';

// const IMAGE_URL = 'https://cdn0-production-images-kly.akamaized.net/oiwMGItCEPkWebOsd_PX3ylXRd8=/1200x1200/smart/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/3551964/original/052932000_1629966509-198866300_388468995863054_7712447264754457056_n.jpg';

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        password: "",
        entries: 0,
        joined: new Date()
      }
    }
  }


  componentDidMount() {
    fetch('http://localhost:3000')
    .then(response => response.json())
        .then(console.log)
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFAceLocation = (data) => {
    const clarifaiFace = data;
    const image = document.querySelector('#inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});
  const USER_ID = 'jerryyip1999';
  const PAT = '84f1fe96264344bf9b0b0b00ffc6d555';
  const APP_ID = 'SmartBrain';

  const MODEL_ID = 'face-detection';
  const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';  
  const IMAGE_URL = this.state.input;

  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
  .then(response => {
    if(response){
      fetch('http://localhost:3000/image', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: this.state.user.id,
        })
      })
      .then(response => response.json())
      .then(count => {
        this.setState(Object.assign(this.state.user, {entries: count}))
      })
    }
  return response.json()}
    )
  .then(result => {
    this.displayFaceBox(this.calculateFAceLocation(result.outputs[0].data.regions[0].region_info.bounding_box))
  })
  .catch(error => console.log('error', error));
  
  }

  onRouteChange = (route) => {
    if(route === 'singout'){
      this.setState({isSignIn: false})
    } else if (route === 'home'){
      this.setState({isSignIn: true})
    }
    this.setState({route: route})
  }

  render(){
    return (
      <div className="App">
        <ParticlesBg type="circle" bg={true} />
        <Navigation isSingedIn={this.state.isSignIn} onRouteChange={this.onRouteChange} />
        <Logo />
        { this.state.route === 'home'
        ? <div>
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
          </div>
        : (this.state.route === 'signin' 
        ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />)
        }
      </div>
    );
  }
}

export default App;
