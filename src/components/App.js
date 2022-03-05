import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Switch } from "react-router-dom";
import Marketplace from './Marketplace';
import Nav from './Nav';
import Web3 from 'web3';
import './App.css';
import MemoryToken from '../abis/MemoryToken.json';
import logo from '../logo_ball.png';
//import * as fs from 'fs'
import $ from 'jquery';

const CARD_MEM_ARRAY = [
  {
    name: 'fans',
    img: '/images/fans.png'
  },
  {
    name: 'kick',
    img: '/images/kick.jpg'
  },
  {
    name: 'ball',
    img: '/images/ball.jpg'
  },
  {
    name: 'stadium',
    img: '/images/stadium.jpg'
  },
  {
    name: 'goalkeeper',
    img: '/images/goalkeeper.png'
  },
  {
    name: 'goal',
    img: '/images/goal.png'
  },
  {
    name: 'fans',
    img: '/images/fans.png'
  },
  {
    name: 'kick',
    img: '/images/kick.jpg'
  },
  {
    name: 'ball',
    img: '/images/ball.jpg'
  },
  {
    name: 'stadium',
    img: '/images/stadium.jpg'
  },
  {
    name: 'goalkeeper',
    img: '/images/goalkeeper.png'
  },
  {
    name: 'goal',
    img: '/images/goal.png'
  }
]

const CARD_ARRAY = [
  {
    name: 'Antonio',
    img: '/images/deck/antonio.jpg'
  },
  {
    name: 'De Bruyne',
    img: '/images/deck/debruyne.jpg'
  },
  {
    name: 'Dias',
    img: '/images/deck/dias.jpg'
  },
  {
    name: 'Folden',
    img: '/images/deck/folden.jpg'
  },
  {
    name: 'Kante',
    img: '/images/deck/kante.jpg'
  }, 
  {
    name: 'Lacazette',
    img: '/images/deck/lacazette.jpg'
  },
  {
    name: 'Maillot city',
    img: '/images/deck/maillot_city.jpg'
  },
  {
    name: 'Sadio Mane',
    img: '/images/deck/mane.jpg'
  },
  {
    name: 'Richarlison',
    img: '/images/deck/richarlison.jpg'
  },
  {
    name: 'Mohamed Salah',
    img: '/images/deck/salah.jpg'
  },
  {
    name: 'Thiago Silva',
    img: '/images/deck/silva.jpg'
  },
  {
    name: 'Son',
    img: '/images/deck/son.jpg'
  },
  {
    name: 'Jimmy Vardy',
    img: '/images/deck/vardy.jpg'
  },
  {
    name: 'Theo Walcott',
    img: '/images/deck/walcott.jpg'
  },
  {
    name: 'logo Chelsea [RARE]',
    img: '/images/deck/rare_chelsea_logo.jpg'
  },
  {
    name: 'Bruno Fernandez [RARE]',
    img: '/images/deck/rare_fernandez.jpg'
  },
  {
    name: 'Harry Kane [RARE]',
    img: '/images/deck/rare_kane.jpg'
  },
  {
    name: 'Youri Tielemans [RARE]',
    img: '/images/deck/tielemans.jpg'
  },
  {
    name: 'Traore [RARE]',
    img: '/images/deck/rare_traore.jpg'
  },
  {
    name: 'Van Dijk [RARE]',
    img: '/images/deck/rare_vandijk.jpg'
  },
  {
    name: 'Beckham [EPIQUE]',
    img: '/images/deck/epique_beckham.jpg'
  }, 
  {
    name: 'Henry [EPIQUE]',
    img: '/images/deck/epique_henry.jpg'
  },
  {
    name: 'Rooney [EPIQUE]',
    img: '/images/deck/epique_rooney.jpg'
  },
]

var randomIndex;

var onSale_tokenURIs = [ "/images/deck/epique_rooney.jpg-Rooney [EPIQUE]-55-Owner -10.5",
                         "/images/deck/rare_vandijk.jpg-Van Dijk [RARE]-56-Owner -2.3",
                         "/images/deck/kante.jpg-Kante-57-Owner-0.5",
                         "/images/deck/maillot_city.jpg-Maillot City-32-0x70946CE5997d62ef413398Ba3ACA4AfEFbB56fE0-0.7"
];

var x = 5;

function mysleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function popin(img){
  img.style.transitionDuration = '0.2s';
  img.style.transform = 'translate(-50%, -50%) scale(1.5)';
  console.log(img);

  setTimeout(() => {
    img.style.transitionDuration = '0.07s';
    img.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 200);

}

function popout(img){
  img.style.transitionDuration = '0.2s';
  img.style.transform = 'translate(-50%, -50%) scale(1.5)';
  console.log(img);

  setTimeout(() => {
    img.style.transitionDuration = '0.07s';
    img.style.transform = 'translate(-50%, -50%) scale(0)';
  }, 200);
}

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    this.setState({ cardArray: CARD_MEM_ARRAY.sort(() => 0.5 - Math.random()) })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    
    
    // Load smart contract
    const networkId = await web3.eth.net.getId()
    const networkData = MemoryToken.networks[networkId]
    if(networkData) {
      const abi = MemoryToken.abi
      const address = networkData.address
      const token = new web3.eth.Contract(abi, address)
      this.setState({ token })
      const totalSupply = await token.methods.totalSupply().call()
      this.setState({ totalSupply })
      // Load Tokens
      let balanceOf = await token.methods.balanceOf(accounts[0]).call()
      for (let i = 0; i < balanceOf; i++) {
        let tokenID = await token.methods.tokenOfOwnerByIndex(accounts[0], i).call()
        //console.log(id);
        let tokenURI = await token.methods.tokenURI(tokenID).call()
        //console.log(tokenURI);
        this.setState({
          tokenURIs: [...this.state.tokenURIs, tokenURI.concat('-',tokenID)]
         //tokenIDs: [...this.state.tokenIDs, tokenID]
        })
      }
    } else {
      alert('Smart contract not deployed to detected network.')
    }
  }

  chooseImage = (cardId) => {
    cardId = cardId.toString()
    if(this.state.cardsWon.includes(cardId)) {
      return window.location.origin + '/images/white.png'
    }
    
    else if(this.state.cardsChosenId.includes(cardId)) {
      return CARD_MEM_ARRAY[cardId].img
    } else {
      return window.location.origin + '/images/question.png'
    }
    /*
    else {
      return CARD_MEM_ARRAY[cardId].img
    } 
    */
  }

  flipCard = async (cardId) => {
    let alreadyChosen = this.state.cardsChosen.length

    this.setState({
      cardsChosen: [...this.state.cardsChosen, this.state.cardArray[cardId].name],
      cardsChosenId: [...this.state.cardsChosenId, cardId]
    })

    if (alreadyChosen === 1) {
      setTimeout(this.checkForMatch, 100)
    }
  }

  
    /* When the user clicks on the image, 
toggle between hiding and showing the dropdown content */
  options = async (cardId) => {
    document.getElementById("myDropdown").classList.toggle("show");
  }


  checkForMatch = async () => {

    const optionOneId = this.state.cardsChosenId[0]
    const optionTwoId = this.state.cardsChosenId[1]

    const randomIndexBasic = Math.floor(Math.random() * CARD_ARRAY.slice(0,17).length)
    const randomIndexRare = 17 + Math.floor(Math.random() * CARD_ARRAY.slice(17,23).length)
    const randomIndexEpique = 23 + Math.floor(Math.random() * CARD_ARRAY.slice(23,26).length)
    var randomIndexArray = [randomIndexBasic, randomIndexRare, randomIndexEpique];
    var weights = [0.9, 0.09, 0.01]; // probabilities

    var num = Math.random(),
        s = 0,
        l = weights.length - 1;

    for (var i = 0; i < l; ++i) {
        s += weights[i];
        if (num < s) {
            randomIndex = randomIndexArray[i];
            break;
        }
    }
    
    this.state.nft_src = CARD_ARRAY[randomIndex].img

    if(optionOneId == optionTwoId) {
      alert('You have clicked the same image!')
    } else if (this.state.cardsChosen[0] === this.state.cardsChosen[1]) {
      alert('You found a match')
      this.state.token.methods.mint(
        this.state.account,
        CARD_ARRAY[randomIndex].img.toString().concat('-',CARD_ARRAY[randomIndex].name.toString())
      )
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        this.setState({
          cardsWon: [...this.state.cardsWon, randomIndex, randomIndex],
          tokenURIs: [...this.state.tokenURIs, CARD_ARRAY[randomIndex]]
        })
      })

      this.state.won_nft = document.createElement("img")
      this.state.won_nft.src = CARD_ARRAY[randomIndex].img
      popin(this.state.won_nft)
      await mysleep(2000)
      popout(this.state.won_nft)

    } else {
      alert('Sorry, try again')
    }
    this.setState({
      cardsChosen: [],
      cardsChosenId: []
    })
    if (this.state.cardsWon.length === CARD_MEM_ARRAY.length) {
      alert('Congratulations! You found them all!')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      won_nft: null,//'/images/deck/salah.jpg',
      nft_src: null,
      token: null,
      totalSupply: 0,
      tokenURIs: [],
      cardArray: [],
      cardsChosen: [],
      cardsChosenId: [],
      cardsWon: []
    }
  }


  render() {


    const Home = () => (
      
      <div className="container-fluid mt-5">
              <div className="row">
                  <main role="main" className="col-lg-12 d-flex text-center">
                      <div className="content mr-auto ml-auto">
                      <h1 className="d-3">Let's play ! Try to find a match and win a card ! </h1>
                          <div>
                              <div className="grid grid-cols-4" >
                                { this.state.cardArray.map((card, key) => {
                                  return(
                                    <img
                                      key={key}
                                      src={this.chooseImage(key)}
                                      width={100}
                                      height={100}
                                      data-id={key}
                                      onClick={(event) => {
                                        let cardId = event.target.getAttribute('data-id')
                                        if(!this.state.cardsWon.includes(cardId.toString())) {
                                          this.flipCard(cardId)
                                        }
                                      }}
                                    />
                                  )   
                                })}
                              </div>
                            </div>
                  
                            <div>
                            <img id="wn" src={this.state.won_nft} alt=""/>
    
                              <h5>My deck:<span id="result">&nbsp;{this.state.tokenURIs.length}</span></h5>
    
                              <div className="col-12" >
                                { this.state.tokenURIs.map((token, key) => {
                                    
                                    token = token + '';

                                    var tokenSplit = token.split("-");
                                    var tokenSrc = tokenSplit[0];
                                    console.log(tokenSrc)

                                  return(
                                    <div class="dropdown">
                                      <img class="dropbtn"
                                        key={key}
                                        src={tokenSrc}
                                        data-id={key}
                                        onClick={(event) => {

                                          var setPrice = window.prompt("Enter the price you want: ");
                                          
                                          if (setPrice!=null) {

                                            // approval for all tokens of a specific account
                                            this.state.token.methods.setApprovalForAll('0x858582B971F94a521E06354a74B62Cd8dc99C1ad', true)
                                            .send({ from: this.state.account })
                                            .on('transactionHash', (hash) => {})

                                            token = token.concat('-', this.state.account)
                                            token = token.concat('-', setPrice)
                                            onSale_tokenURIs.push(token);
                                            //console.log(JSON.stringify(onSale_tokenURIs))
                                            localStorage.setItem('onSale_tokenURIs',JSON.stringify(onSale_tokenURIs));
                                          }
                                          document.getElementById("myDropdown").style.top= event.clientY + 'py';
                                          document.getElementById("myDropdown").style.left= event.clientX + 'px';
                                          let cardId = event.target.getAttribute('data-id')
                                          if(!this.state.cardsWon.includes(cardId.toString())) {
                                            this.options(cardId)
                                            
                                          }
                                        }}
                                      />
                                    <div id="myDropdown" class="dropdown-content">
                                      <a onClick={(event) => { 
                                        //console.log(onSale_tokenURIs)
                                        }}>Sell on the marketplace</a>
                                    </div>
                                  </div>
                                  )
                                })}
    
                              </div>
    
                            </div>
    
                          </div>
    
                  </main>
                </div>
              </div>
    )


    return (
      
      <div>
        <Router>
        <Nav />
        <Routes>
          <Route path="/" element={Home()} />
          <Route path="/marketplace" element={Marketplace()} />
        </Routes>
        </Router>
        </div>

    );
  }
}


  


export default App;

