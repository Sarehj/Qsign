import "./Home.css";
import Header from "../Header/Header";
import { Link } from "react-router-dom";

function Home(props) {
  return (
    <div className="home-container">
      <Header
        isLoggedIn={props.isLoggedIn}
        userInfo={props.userInfo}
        setIsLoggedIn={props.setIsLoggedIn}
        setUserInfo={props.setUserInfo}
      />
      <div className="container">
        <section className="welcome-text">
          <p class="line-1 anim-typewriter">A Secure Place To Sign Documents</p>
          <h5>
            Don't trust a pen - trust <span></span>
          </h5>
        </section>
      </div>
      <Link to="/Login">
        <button className="btn-get-started"> Get Started</button>
      </Link>
    </div>
  );
}

export default Home;
