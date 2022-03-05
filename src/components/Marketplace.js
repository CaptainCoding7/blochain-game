import React, { Component, Fragment } from 'react';
import Web3 from 'web3'
import './Marketplace.css';
import Nav from './Nav';
import MemoryToken from '../abis/MemoryToken.json'
import logo from '../logo_ball.png'

/* Recuperation des items en vente */
// test array:
var onSale_tokenURIs2 = ["http://localhost:3000/images/deck/dias.jpgDias", "http://localhost:3000/images/deck/walcott.jpgWalcott", "http://localhost:3000/images/deck/debruyne.jpgDe Bruyne" ]
var onSale_tokenURIs = localStorage.getItem('onSale_tokenURIs')
onSale_tokenURIs = onSale_tokenURIs.split(",");
console.log("GET = "+ onSale_tokenURIs)
//console.log("GET=" + JSON.parse(localStorage.getItem('onSale_tokenURIs')));

/** Connection au wallet pour obtenir la balance*/

var balanceAccount;
var account;
var token;

async function connectToWallet(){

    if (typeof window.ethereum !== 'undefined') {
        //console.log('MetaMask is installed!');

        // Instance web3 with the provided information  
        var web3 = new Web3(window.ethereum);
        try {  
            // Request account access  
            await window.ethereum.enable();  
            var accounts = await web3.eth.getAccounts();
            //console.log(accounts);
            var balance = web3.utils.fromWei((await web3.eth.getBalance(accounts[0])).toString(), 'ether');
            balanceAccount = balance;
            account=accounts[0];

        } catch(e) {  
            console.log(e)
            // User denied access  
        }
    }
}

async function prepare(){

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

    const web3 = window.web3
    // Load smart contract
    const networkId = await web3.eth.net.getId()
    const networkData = MemoryToken.networks[networkId]

    if(networkData) {
        const abi = MemoryToken.abi
        const address = networkData.address
        token = new web3.eth.Contract(abi, address)
    }

}



async function buy(from,to,tokenID, tokenPrice){

    
    if(tokenPrice>balanceAccount){
        alert("Vous n'avez pas assez de fonds !");
    }
    else{   

        console.log("Transfert...")
        console.log("From = " + from)
        console.log("To = " + to )
        console.log("TokenID = " + tokenID)

        /***************** METHODS TESTS **********************/

        //await token.methods.onERC721Received(from,from,tokenID,null)
        /*
        await token.methods.approve(to, tokenID)
        .send({ from: to })
        .on('transactionHash', (hash) => {})
        */

        /*
        await token.methods.allowBuy(tokenID, tokenPrice)
        .send({ from: owner })
        .on('transactionHash', (hash) => {})

        await token.methods.buy(tokenID)
        .send({ from: to })
        .on('transactionHash', (hash) => {})
        */

        /******************************************************/

        let before = await token.methods.balanceOf(to).call()
        console.log("AVANT : " + before )
        console.log("test")
        let owner = await token.methods.ownerOf(tokenID).call()
        console.log(owner)

        //to = await token.methods.getApproved(tokenID);
        await token.methods.transferFrom(from,to,tokenID); 

        let after = await token.methods.balanceOf(to).call()
        console.log("APRES =" + after)

        // removing the token from the marketplace array
        var i = onSale_tokenURIs.findIndex(v => v.includes("-"+tokenID+"-"));
        onSale_tokenURIs.splice(i,1)
        console.log(onSale_tokenURIs)

        alert("Achat effectué !")

    }
}


function Marketplace (){
        prepare();
        connectToWallet();
        return(
            
                <div id="__next" data-reactroot="">
                    <div class=" ">
                        <div class="grid grid-cols-4">
                            <div class="bg-[#FBFBFB] dark:bg-[#191D3A] p-8 col-span-1 transition-colors duration-400 ease-linear">
                                <div class="h-full">
                                    <div class="flex flex-col items-center space-y-1 mt-5 py-8 px-2 rounded-xl bg-white dark:bg-[#7B62FF] drop-shadow-xl">
                                        <h class="text-sm font-bold text-[#A4A5B1] dark:text-gray-200"> Your Balance </h>
                                        <p class="font-bold text-2xl dark:text-white"> {balanceAccount} </p>
                                        <div class="flex items-center"><img alt="Img" class="w-[13px] h-[13px]" src="./eth_logo.png "/>
                                            <p class="text-sm ml-2 text-[#A4A5B1] dark:text-gray-200">ETH</p>
                                        </div>
          
                                        <div class="flex space-x-2 rounded-xl border-2 p-2 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400 dark:text-yellow-300" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd"></path></svg>
                                            <p class="text-sm font-bold dark:text-white"> Top Up Balance</p><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 dark:text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg></div>
                                    </div>
                                    <div class="mt-12">
                                        <div class="flex items-center mt-4 hover:text-[#755EFC] dark:hover:text-[#755EFC] dark:text-gray-400 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" class="h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                                            <p class="ml-5">Play</p>
                                        </div>
                                        <div class="flex items-center mt-4 hover:text-[#755EFC] dark:hover:text-[#755EFC] dark:text-gray-400 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" class="h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                            <p class="ml-5">Market</p>
                                            <p class="rounded-full text-sm bg-yellow-300 dark:bg-yellow-700 dark:text-yellow-300 text-white px-2 ml-auto">PRO</p>
                                        </div>
                                        <div class="flex items-center mt-4 hover:text-[#755EFC] dark:hover:text-[#755EFC] dark:text-gray-400 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" class="h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                            <p class="ml-5">Active Bids</p>
                                        </div>
                                        <p class="text-[12px] font-bold mt-12 dark:text-gray-400">MY PROFILE</p>
                                        <div class="flex items-center mt-4 hover:text-[#755EFC] dark:hover:text-[#755EFC] dark:text-gray-400 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" class="h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                                            <p class="ml-5">My Deck</p>
                                            <p class="rounded-full text-xs bg-gray-200 text-gray-400 dark:bg-[#292D51] py-0.5 px-1.5 ml-auto">+6</p>
                                        </div>
                                        <div class="flex items-center mt-4 hover:text-[#755EFC] dark:hover:text-[#755EFC] dark:text-gray-400 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" class="h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                            <p class="ml-5">History</p>
                                        </div>
                                        <div class="flex items-center mt-4 hover:text-[#755EFC] dark:hover:text-[#755EFC] dark:text-gray-400 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" class="h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                            <p class="ml-5">Favourites</p>
                                            <p class="rounded-full text-xs bg-gray-200 text-gray-400 dark:bg-[#292D51] py-0.5 px-1.5 ml-auto">+6</p>
                                        </div>
                                        <div class="flex items-center mt-4 text-[#755EFC] dark:text-[#7B62FF] cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" class="h-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                            <p class="ml-5 text-[10px]">SHOW MORE</p>
                                        </div>
                                        <div class="flex items-center mt-12 cursor-pointer dark:text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" class="h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                                            <button class="ml-5">Light mode</button>
                                            <div class="ml-auto flex rounded-full bg-[#EFEFEF] dark:bg-[#292D51] justify-center items-center"><button class=" m-[4px] p-[4px] "><svg xmlns="http://www.w3.org/2000/svg" class="h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg></button>
                                                <button class="transition duration-300 ease-in-out bg-white text-[#755EFC] rounded-full  m-[4px] p-[4px] "><svg xmlns="http://www.w3.org/2000/svg" class="h-4 " fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-[#F9F9F9] dark:bg-[#1E2142] col-span-3 transition-colors duration-400 ease-linear" styles="width:2000;">
                                <header class="flex items-center mt-8 ml-16 mr-10">
                                    <div class="mr-auto mt-12">
                                        <h class="text-4xl font-bold mr-auto dark:text-white text-black ">Marketplace</h>
                                    </div>
                                    <div class="mr-20 mb-5 flex items-center cursor-pointer">
                                        <div class="flex rounded-full bg-[#EFEFEF] dark:bg-[#292D51] justify-center items-center"><button class="m-[4px] px-6 py-2 transition duration-300 ease-in-out  bg-white dark:bg-[#1E2142] rounded-full dark:text-white "><p class="text-sm font-bold">Creator</p></button><button class="m-[4px] px-6 py-2 transition duration-300 ease-in-out text-[#A4A5B1]"><p class="text-sm font-bold">Collector</p></button></div>
                                    </div>
                                    <div class="relative rounded-full mb-5 border-2 p-2 dark:border-[#292D51] cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" class="h-[24px] dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                        <div class="bg-[#F7067F] rounded-full px-1.5 py-0.5 absolute top-0 -right-3">
                                            <p class="text-[10px] text-white">+6</p>
                                        </div>
                                    </div>
                                </header>
                                <div className="container-fluid mt-5">
                                    <div className="row">
                                        <main role="main" className="col-lg-12 d-flex text-center">
                                            <div className="content mr-auto ml-auto">
                                                <div>
                                                    <div className="grid grid-cols-4" >
                                                        { onSale_tokenURIs.map((token, key) => {
                                                            
                                                            token=token.replace('"','')
                                                            token=token.replace('[','')
                                                            token=token.replace(']','')

                                                            //console.log(token)
                                                            var tokenSplit = token.split("-");
                                                            var tokenSrc = tokenSplit[0];
                                                            var tokenName = tokenSplit[1];
                                                            var tokenID = tokenSplit[2];
                                                            var tokenOwner = tokenSplit[3];
                                                            var tokenPrice = tokenSplit[4];
                                                            
                                                            console.log(tokenSplit)

                                                            return(
                                                                <div>
                                                                    <img class="NFT_buy"
                                                                        key={key}
                                                                        src={tokenSrc}
                                                                        data-id={key}
                                                                        onClick={(event) => {
                                                                            if(account == tokenOwner)
                                                                                alert("Vous ne pouvez pas acheter votre propre carte! ");
                                                                            else{
                                                                                let isConf = window.confirm("Voulez-vous acheter la carte "+tokenName+ " pour "+tokenPrice+" ETH ?");
                                                                                if (isConf)
                                                                                    buy(tokenOwner, account, tokenID, tokenPrice)
                                                                                    // test:
                                                                                    //buy('0x70946CE5997d62ef413398Ba3ACA4AfEFbB56fE0', '0x858582B971F94a521E06354a74B62Cd8dc99C1ad',tokenID)
                                                                            }   
                                                                        }}
                                                                    />
                                                                    <div class="bg-white dark:bg-[#292D51] rounded-2xl pt-1 cursor-pointer">
                                                                        <div class="relative m-3">
                                                                        </div>
                                                                        <div class="flex px-5 pt-1 pb-4 items-end">
                                                                            <div class="mr-auto">
                                                                                <p class="font-bold dark:text-white">{tokenName}</p>
                                                                                <p class="text-sm text-gray-400 mt-1">{tokenOwner}</p>
                                                                            </div>
                                                                            <div class="relative w-[32px] h-[32px] "><span styles="box-sizing:border-box;display:block;overflow:hidden;width:initial;height:initial;background:none;opacity:1;border:0;margin:0;padding:0;position:absolute;top:0;left:0;bottom:0;right:0"></span></div>
                                                                        </div>
                                                                    </div>
                                                                    <div class=" bg-transparent  transition-colors duration-300 ease-out rounded-b-2xl ">
                                                                        <div class="flex justify-between px-5 py-2.5">
                                                                            <div>
                                                                                <p class="text-sm text-gray-400">Price</p>
                                                                                <div class="text-black transition-colors duration-300 ease-out flex items-center mt-2"><img alt="Img" class="w-[13px] mr-2" src="/eth_logo.png "/>
                                                                                    <p class="text-[13px] font-bold dark:text-white">{tokenPrice}
                                                                                        ETH</p>
                                                                                </div>
                                                                            </div>
                                                                            <div class="relative flex-1">
                                                                                <p class="text-sm text-gray-400 top-0 right-0 absolute">Ending in</p>
                                                                                <p class="text-black dark:text-white transition-colors duration-300 ease-out font-bold text-sm right-0 bottom-0 absolute">12H3m15</p>
                                                                            </div>
                                                                        </div>
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
                            </div>
                        </div>
                    </div>    

                </div>  
        );
    }

export default Marketplace;