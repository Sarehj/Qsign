import { useState, useEffect } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import { Link } from "react-scroll";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { AiFillCheckCircle } from "react-icons/ai";

function Profile(props) {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState();
  const [fileName, setFileName] = useState();
  const [fileError, setFileError] = useState("");

  const [emailInvites, setEmailInvites] = useState([]);
  const [currentEmailInviteInput, setCurrentEmailInviteInput] = useState("");

  const [fileNameList, setFileNameList] = useState([]);

  const [fileInvitesList, setFileInvitesList] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Id: props.userInfo.id }),
    };
    fetch("https://qsignapi.azurewebsites.net/GetUserFiles", requestOptions)
      .then((p) => p.json())
      .then((p) => {
        setFileNameList(p);
      });

    fetch("https://qsignapi.azurewebsites.net/GetUserInvites", requestOptions)
      .then((p) => p.json())
      .then((p) => setFileInvitesList(p));
  }, []);

  const handleUpload = () => {
    if (selectedFile === undefined || fileName === undefined) {
      setFileError("No file selected");
      return;
    }
    setFileError("");
    setCurrentEmailInviteInput("");
    setEmailInvites([]);

    const formData = new FormData();
    formData.append("FileName", fileName);
    formData.append("FormFile", selectedFile);
    formData.append("IssuerId", props.userInfo.id);

    fetch(`https://qsignapi.azurewebsites.net/UploadDocument`, {
      method: "POST",
      body: formData,
    })
      .then((p) => p.json())
      .then((p) => {
        //setFileNameList(...fileNameList, p);
        setFileNameList((oldState) => [
          ...oldState,
          { id: p.id, filename: p.filename },
        ]);
        const requestOptions = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: props.userInfo.id,
            emails: emailInvites,
            documentId: p.id,
          }),
        };
        fetch(
          `https://qsignapi.azurewebsites.net/SendDocumentInvite2`,
          requestOptions
        ).then(alert("Document has been Uploaded"));
      });
  };

  const renderFiles = () => {
    if (fileNameList.length === 0) {
      return <p className="no-files">You have no uploaded files</p>;
    }
    return fileNameList.map((p) => (
      <div className="file-list-item">
        <p className="file-list">
          <b>File name: </b>
          {p.filename}
        </p>
        <button onClick={() => navigate(`/Document/${p.id}`)}>
          View Document
        </button>
        {/* <button>View Signature</button> */}
      </div>
    ));
  };

  const renderFileInvites = () => {
    if (
      fileInvitesList.length === 0 ||
      fileInvitesList === "No document invites"
    ) {
      return <p className="no-files">You have no documents to sign</p>;
    }
    return fileInvitesList.map((p) => (
      <div className="file-list-item-toSign">
        <b>Status: </b>
        {p.isSigned.toString() === "true" ? (
          <b style={{ color: "green" }}>
            Signed <AiFillCheckCircle scale={1.5} />
          </b>
        ) : (
          <b style={{ color: "orange" }}>
            Pending <AiFillCheckCircle scale={1.5} />
          </b>
        )}
        <p>
          {" "}
          <b>Issuer: </b> {p.firstName} {p.lastName}
        </p>
        {/* <p>{p.email}</p> */}
        <p>
          <b>File name: </b>
          {p.filename}
        </p>
        <button onClick={() => navigate(`/Document/${p.documentId}`)}>
          View Document
        </button>
      </div>
    ));
  };

  const addEmail = () => {
    setEmailInvites((arr) => [...arr, currentEmailInviteInput]);
  };

  if (!props.isLoggedIn) navigate("/Login");

  return (
    <div className="profile-all">
      <div className="blur">
        <Header
          isLoggedIn={props.isLoggedIn}
          userInfo={props.userInfo}
          setIsLoggedIn={props.setIsLoggedIn}
          setUserInfo={props.setUserInfo}
        />
        <div className="profile-container">
          <div className="profile-logo" />
          <h1 className="profile-greeter">
            Welcome {props.userInfo.firstName}
          </h1>

          <p className="profile-issue-document">
            Start issuing documents to sign or handle existing documents
          </p>

          <div className="nav-buttons">
            <Link to="file-sign" spy={true} smooth={true}>
              <button>Your documents</button>
            </Link>
            <Link to="file-view" spy={true} smooth={true}>
              <button>Documents to sign</button>
            </Link>
            <button onClick={() => navigate("/ProfileSettings")}>
              View profile
            </button>
          </div>
        </div>
        <div className="upload-file-container">
          <h2>Upload a document</h2>
          <p>
            Choose a file to upload and send an invite for someone else to sign.
          </p>
          <input
            className="file-input"
            type="file"
            name="file"
            onChange={(e) => {
              setSelectedFile(e.target.files[0]);
              setFileName(e.target.files[0].name);
            }}
          ></input>
          {/* <button onClick={handleSubmit} className="upload-document-button">Upload File</button> */}
          <Popup
            trigger={
              <button className="upload-document-button">
                Upload Document
              </button>
            }
            modal
            nested
          >
            {(close) => (
              <div className="modal">
                <button
                  className="close"
                  onClick={() => {
                    close();
                    setEmailInvites([]);
                    setCurrentEmailInviteInput("");
                  }}
                >
                  &times;
                </button>
                <div className="header">Upload Document</div>
                <div className="content">
                  <h2>Send invite:</h2>
                  <div className="send-invite-input-container">
                    <input
                      type="text"
                      placeholder=" Email..."
                      value={currentEmailInviteInput}
                      onChange={(e) =>
                        setCurrentEmailInviteInput(e.target.value)
                      }
                    />
                    <button
                      className="add-btn"
                      onClick={() => {
                        addEmail();
                        setCurrentEmailInviteInput("");
                      }}
                    >
                      Add
                    </button>
                  </div>
                  {emailInvites.map((p) => (
                    <li>{p}</li>
                  ))}
                  <br></br>
                  <button
                    className="upload-btn"
                    onClick={() => {
                      handleUpload();
                      close();
                    }}
                  >
                    Upload
                  </button>
                </div>
              </div>
            )}
          </Popup>
          <p className="file-error">{fileError}</p>
        </div>

        <div className="file-view-container" id="file-view">
          <h2>Documents to sign</h2>
          <p>Here you can view the documents you have been invited to sign</p>
          <p>You can see the status on each document below</p>
          <br></br>
          <p>
            <b style={{ color: "orange" }}>
              Pending <AiFillCheckCircle scale={1.5} />
            </b>{" "}
            = Document you haven't signed yet
          </p>
          <br></br>
          <p>
            <b style={{ color: "green" }}>
              Signed <AiFillCheckCircle scale={1.5} />
            </b>{" "}
            = Documents you have signed
          </p>
          {renderFileInvites()}
        </div>
        <div className="sign-file-container" id="file-sign">
          <h2>These are your documents</h2>
          <p>Here you can view the documents you have uploaded</p>
          {renderFiles()}
        </div>
      </div>
    </div>
  );
}

export default Profile;
