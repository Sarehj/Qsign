import './ProfileSettings.css';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../Header/Header";
import Popup from "reactjs-popup";
import "../Documents/DocumentInfo.css";
import "./ProfileSettings.css";




function ProfileSettings(props) {
  const [copySuccess, setCopySuccess] = useState('');
  const navigate = useNavigate();
  const copyToClipBoard = async copyMe => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopySuccess('Copied!');
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };
  if(!props.isLoggedIn) navigate("/Login");

  return (
    <div className="profile-settings-all">
      <div className="blur">
      <Header isLoggedIn={props.isLoggedIn} userInfo={props.userInfo} setIsLoggedIn={props.setIsLoggedIn} setUserInfo={props.setUserInfo} />
        <div className="profile-settings-container">
           <h2>View your personal data</h2>
          <p>First name: {props.userInfo.firstName}</p>
          <p>Last name: {props.userInfo.lastName}</p>
          <p>Email: {props.userInfo.email}</p>
          <Popup
                      trigger={<button className="button"> View public key </button>}
                      modal
                      nested
                    >
                      {(close) => (
                        <div className="modal">
                          <button className="close" onClick={() => {close(); setCopySuccess('');}}>
                            &times;
                          </button>
                          <div className="header"> Public key </div>
                          <div className="content"> {props.userInfo.pubKeyPem}<br></br>
                          <button className='button' onClick={() => copyToClipBoard(props.userInfo.pubKeyPem)} >
                          Copy</button>
                          {copySuccess}
                          </div>
                        </div>
                      )}
                    </Popup>

                    <br>
                    </br>
                    <Popup
                      trigger={<button className="button"> View private key </button>}
                      modal
                      nested
                    >
                      {(close) => (
                        <div className="modal">
                          <button className="close" onClick={() => {close(); setCopySuccess('');}}>
                            &times;
                          </button>
                          <div className="header"> Private key </div>
                          <div className="content"> {props.userInfo.privKeyPem}<br></br>
                          <button className='button' onClick={() => copyToClipBoard(props.userInfo.privKeyPem)} >
                          Copy</button>
                          {copySuccess}
                          </div>
                        </div>
                      )}
                    </Popup>
<br></br>
                    <article>More features to come here soon!
                          Page under construction

                    </article>
         

        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;
