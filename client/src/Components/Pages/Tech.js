import "./Tech.css";
import Header from "../Header/Header";
import { useNavigate, Link } from "react-router-dom";
import { VscClose } from "react-icons/vsc";

function Tech(props) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (props.isLoggedIn) {
      navigate("/Profile");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="tech-all">
      <div className="blur">
        <Header
          isLoggedIn={props.isLoggedIn}
          userInfo={props.userInfo}
          setIsLoggedIn={props.setIsLoggedIn}
          setUserInfo={props.setUserInfo}
        />
        <div className="tech-container">
          <section className="tech-text">
            <article>
              <h2>
                <VscClose
                  className="howtouse-back-btn"
                  onClick={handleBack}
                ></VscClose>
              </h2>
              <h2>The tech</h2>
              <div class="youtube-player">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/s22eJ1eVLTU"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
              <p>
                QSign uses RSA encryption for digital signatures. It is
                recommended that you verify every signature externally and
                offline. This page will explain how to do so. <Link to='/HowToVerifySignature'>How to verify Signature</Link>
                <br></br>
                <br></br>
                When signing a document it isn’t actually the document that is
                being signed, but something called a hash. A hash is a
                cryptographic function that can map data of arbitrary size to
                fixed-size values. QSign uses SHA 256 to hash document. Every
                piece of data is mapped to a unique hash. Therefore signing the
                hash of a document is equivalent to signing the document itself.
              </p>
            </article>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Tech;
