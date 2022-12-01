import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./DocumentInfo.css";
import Header from "../Header/Header";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import {VscClose} from "react-icons/vsc";

function DocumentInfo(props) {
  let { id } = useParams();
  const [docInfo, setDocInfo] = useState([]);
  const [pubUserInfo, setPubUserInfo] = useState([]);
  const [sigInfo, setSigInfo] = useState([]);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    fetch(`https://qsignapi.azurewebsites.net/GetDocumentInfo/${id}`)
      .then((p) => p.json())
      .then((p) => {
        setDocInfo(p);

        fetch(`https://qsignapi.azurewebsites.net/GetUserPublicInfo/${p.issuerPublicId}`)
          .then((p) => p.json())
          .then((p) => setPubUserInfo(p));
      });
    fetch(`https://qsignapi.azurewebsites.net/GetDocumentSignatures/${id}`)
      .then((p) => p.json())
      .then((p) => setSigInfo(p));
  }, []);

  const copyToClipBoard = async copyMe => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopySuccess('Copied!');
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };

  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/Profile");
  };

  const handleSign = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ issuerId: props.userInfo.id, documentId: id}),
    };
    fetch('https://qsignapi.azurewebsites.net/Sign', requestOptions).then(alert("Document has been signed"));
  }

  if(!props.isLoggedIn) navigate("/Login");

  return (
      
      <div className="document-info-all">
        <div className="blur">
        <Header
          isLoggedIn={props.isLoggedIn}
          userInfo={props.userInfo}
          setIsLoggedIn={props.setIsLoggedIn}
          setUserInfo={props.setUserInfo}
        />
          <div className="document-info-container">
          <h2><VscClose className="howtouse-back-btn" onClick={handleBack}></VscClose></h2>
            <h1 className="document-info-header">Document Information</h1>
            <div className="document-info-table">
              <table>
                <tr>
                  <th>Issuer: </th>
                  <td>
                    {pubUserInfo.firstName} {pubUserInfo.lastName}
                  </td>
                </tr>
                <tr>
                  <th>Issuer email: </th>
                  <td>{pubUserInfo.email}</td>
                </tr>
                <tr>
                  <th>File name: </th>
                  <td>{docInfo.filename}</td>
                </tr>
                <tr>
                  <th>Document Hash: </th>
                  <td>
                    <Popup
                      trigger={<button className="button"> View hash </button>}
                      modal
                      nested
                    >
                      {(close) => (
                        <div className="modal">
                          <button className="close" onClick={() => {close(); setCopySuccess('');}}>
                            &times;
                          </button>
                          <div className="header"> Hash </div>
                          <div className="content"> {docInfo.hash}<br></br>
                          <button onClick={() => copyToClipBoard(docInfo.hash)} >
                          Copy</button>
                          {copySuccess}
                          </div>
                        </div>
                      )}
                    </Popup>
                  </td>
                </tr>

                <tr>
                  <th>Public Key:</th>
                  <td>
                    <Popup
                      trigger={
                        <button className="button"> View public key </button>
                      }
                      modal
                      nested
                    >
                      {(close) => (
                        <div className="modal">
                          <button className="close" onClick={() => {close(); setCopySuccess('');}}>
                            &times;
                          </button>
                          <div className="header"> Public key </div>
                          <div className="content">
                            {" "}
                            {pubUserInfo.pubKeyPem}<br></br>
                            <button onClick={() => copyToClipBoard(pubUserInfo.pubKeyPem)} >
                          Copy</button>
                          {copySuccess}
                          </div>
                        </div>
                      )}
                    </Popup>
                  </td>
                </tr>
              </table>
            </div>
            <div className="btn-sign-download">
            <button onClick={handleSign}> Sign document </button>
            <a href={`https://qsignapi.azurewebsites.net/GetDocument/${id}`}>Download</a>
            </div>
            <div className="document-sign-table">
          
              <table>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date Signed</th>

                  <th>Signer Public Key</th>
                  <th>Signature</th>
                </tr>
                {sigInfo.map((p) => (
                  <tr>
                    <td>
                      {p.firstName} {p.lastName}
                    </td>
                    <td>{p.email}</td>
                    <td>{p.issuedAt.split("T", 1)}</td>

                    <td>
                      <Popup
                        trigger={
                          <button className="signtb-button"> View Public Key </button>
                        }
                        modal
                        nested
                      >
                        {(close) => (
                          <div className="modal">
                            <button className="close" onClick={() => {close(); setCopySuccess('');}}>
                              &times;
                            </button>
                            <div className="header"> Issuer pub key </div>
                            <div className="content"> {p.issuerPubKeyPem}<br></br>
                            <button onClick={() => copyToClipBoard(p.issuerPubKeyPem)} >
                          Copy</button>
                          {copySuccess}</div>
                            
                          </div>
                        )}
                      </Popup>
                    </td>
                    <td>
                      <Popup
                        trigger={
                          <button className="signtb-button">View Signature </button>
                        }
                        modal
                        nested
                      >
                        {(close) => (
                          <div className="modal">
                            <button className="close" onClick={() => {close(); setCopySuccess('');}}>
                              &times;
                            </button>
                            <div className="header"> Signature</div>
                            <div className="content"> {p.signature}<br></br>
                            <button onClick={() => copyToClipBoard(p.signature)} >
                          Copy</button>
                          {copySuccess}
                            </div>
                          </div>
                        )}
                      </Popup>
                    </td>
                  </tr>
                ))}
              </table>
            </div>
            
          </div>
        </div>
      </div>
  );
}

export default DocumentInfo;