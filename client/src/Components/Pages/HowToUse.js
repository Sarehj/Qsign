import "./HowToUse.css";
import Header from "../Header/Header";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import raw from './codeSnippet.txt';
import { useState, useEffect } from 'react';
import fileStructureImage from '../Images/fileStructure.png'
import {VscClose} from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

function HowToUse(props) {
  const [codeSnippet, setCodeSnippet] = useState("");

  useEffect(() => {
    fetch(raw).then(p => p.text()).then(p => setCodeSnippet(p));
  }, [])

  const navigate = useNavigate();
  const handleBack = () => {
    if(props.isLoggedIn) {navigate("/Profile")}
    else {navigate("/")}
  };


  return (
    <div className="howtouse-all">
      <div className="blur">
        <Header
          isLoggedIn={props.isLoggedIn}
          userInfo={props.userInfo}
          setIsLoggedIn={props.setIsLoggedIn}
          setUserInfo={props.setUserInfo}
        />
        <div className="howtouse-container">
          <section className="howtouse-text">
            <article>
             <h2><VscClose className="howtouse-back-btn" onClick={handleBack}></VscClose></h2>
              <h2>How to verify a signature</h2>
              <br />
              <p className="tutorial">
                This tutorial will explain how to verify a digital signature
                using C#. Make sure you have dotnet installed on your system.
                <br />
                <a href="https://learn.microsoft.com/en-us/dotnet/core/install/windows?tabs=net70">
                  Install .NET
                </a>
                <br />
                <br />
                Open up the terminal and verify that .NET was installed
                correctly by typing
                <div className="terminal-text">C:\&gt; dotnet --list-sdks</div>
                Create a folder called VerifySignature. Inside that folder
                create an empty console application by writing
                <div className="terminal-text">
                  C:\VerifySignature&gt; dotnet new console
                </div>
                Open up any text editor of your choice like visual studio code
                or sublime text. You will see that two files and two directories
                have been created. The "VerifySignature.csproj" file, "obj" and
                "bin" folders can be ignored. We will focus on the Program.cs
                file. It's in there that we will start writing our code. Now in
                the document info page on this website copy the document hash,
                signature and public key of the signer and paste them into three
                files called "hash.txt", "signature.txt", "publicKey.txt".
                <br />
                <br />
                The file structure should look like this:
                <br />
                <br />
                <div className="center-image">
                <img src={fileStructureImage} alt="File structure"/>
                </div>
                <br />
                <br />
                Now paste this code into the "Program.cs" file
                <br /> 
                <br />
                <SyntaxHighlighter language="cs" style={docco}>
                  {codeSnippet}
                </SyntaxHighlighter>
                <br />
                Finally we need to run the program.
                <div className="terminal-text">
                  C:\VerifySignature&gt; dotnet run
                </div>
                If the output is "true" the signature is valid. Otherwise if the signature is invalid the output would be false.
              </p>              
            </article>
          </section>
        </div>
      </div>
    </div>
  );
}

export default HowToUse;
