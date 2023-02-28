import React, { createContext, useEffect, useState } from "react";
import cookies from "js-cookie";
import { initFirebase, } from "../config";
import { getAuth } from "firebase/auth";
import { ethers } from 'ethers';
import { useRouter } from "next/router";
export interface AuthContext {
  values: {};
}


export const GlobalContext = createContext<AuthContext["values"] | null>(null);



initFirebase();
const GlobalProvider = (props: { children: any }) => {
  const auth = getAuth();
  const router = useRouter();
  const [provider, setProvider] = useState<null | any>(
    null
  );
  const [user, setUser] = useState<null | any>(null);
  const [account, setAccount] = useState<any | null>(null);
  const [balance, setBalance] = useState<any | null>(null);
  const [twitterAuthCredential, setTwitterAuthCredential] = useState<any | null>(null);
  const [twitterProvider, setTwitterProvider] = useState<any | null>(null);
  const [connected, setConnected] = useState(false);
  const [chain, setChain] = useState(null)
  const [bst, setBst] = useState(null);
  const [bpoap, setBpoap] = useState(null);
  const [camps, setCamps] = useState<any[] | null>(null)


  const getUserFromCookie = () => {
    const cookie = cookies.get("auth");
    if (!cookie) {
      return;
    }
    return cookie;
  };

  const setUserCookie = (user: { id: any; email: any; token: any }) => {
    cookies.set("auth", user, {
      expires: 1 / 24,
    });
  };
  1;

  const removeUserCookie = () => cookies.remove("auth");

  const mapUserData = async (user: {
    getIdToken?: any;
    uid?: any;
    email?: any;
  }) => {
    const { uid, email } = user;
    const token = await user.getIdToken(true);
    return {
      id: uid,
      email,
      token,
    };
  };


  const logout = async () => {
    return auth
      .signOut()
      .then(() => {
        setConnected(false);
        setTwitterProvider(null);
        setTwitterAuthCredential(null);
        localStorage.setItem("twitterProvider", JSON.stringify(null));
      })
      .catch((e: any) => {
        console.error(e);
      });
  }

  //Unscribe from Authlistner
  useEffect(() => {
    const cancelAuthListener = auth.onIdTokenChanged(async (userToken: any) => {
      if (userToken) {
        const userData = await mapUserData(userToken);
        setUserCookie(userData);
        setUser(userData);
      } else {
        removeUserCookie();
        setUser(null);
      }
    });

    const userFromCookie = getUserFromCookie();

    if (!userFromCookie) {
      return;
    }
    setUser(userFromCookie);

    cancelAuthListener();
  }, []);

  //Get twitter from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const _value = localStorage.getItem("twitterProvider") !== null ? localStorage.getItem("twitterProvider") : null
      if (_value) {
        setTwitterProvider(JSON.parse(_value));
      }
    }
  }, [])



  useEffect(() => {
    //Check if metamask is connected already
    const ethereum = (window as any).ethereum;
    const _provider = new ethers.BrowserProvider(ethereum);
    setProvider(_provider);
    function handleAccountsChanged(accounts: string | any[]) {
      let currentAccount;

      async function switchNetwork() {
        // Switch to the specified network
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{
              chainId: "0x1389",
              // rpcUrls: ["https://rpc.testnet.mantle.xyz"],
            }],
            nativeCurrency: {
              name: "BIT",
              symbol: "BIT",
              decimals: 18
            },
            blockExplorerUrls: ["https://explorer.testnet.mantle.xyz"]
          });
          router.reload();

        } catch (error) {
          console.error(error);
          // If the user doesn't switch networks, you can show an error message here
          return;
        }
      }
      async function getNet(prov: any) {
        const network = await prov.getNetwork();

        if (network) {
          console.log(network)
          setChain(network.chainId);
          if (network.chainId !== 5001n) {
            switchNetwork();
          }
          // if (account) {
          //   const bal = await prov.getBalance(account);
          //   if (bal) {
          //     const x = ethers.formatUnits(bal);
          //     const result = x.slice(0, 6);
          //     setBalance(result)
          //   }
          // }

        }
      }

      if (accounts.length === 0) {
        console.log("no account connected");
        setConnected(false)
      } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        setAccount(currentAccount);
        setConnected(true);
        getNet(_provider);
      }
    }

    function checkConnection() {
      ethereum.request({ method: 'eth_accounts' }).then(handleAccountsChanged).catch(console.error);
    }

    async function isMetamaskConnected() {
      if (typeof ethereum !== "undefined") { // Check if MetaMask is installed
        checkConnection();
      } else {
        return false;
      }
    }

    if (user) {
      isMetamaskConnected();
    }

  }, [user]);




  return (
    <GlobalContext.Provider
      value={{
        mapUserData,
        user,
        setUserCookie,
        getUserFromCookie,
        setTwitterAuthCredential,
        twitterAuthCredential,
        account,
        logout,
        balance,
        twitterProvider,
        setTwitterProvider,
        connected,
        setConnected,
        setAccount,
        setProvider,
        setBalance,
        setChain,
        provider,
        chain,
        bst,
        camps,
        setCamps,
        setBst,
        bpoap,
        setBpoap
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;