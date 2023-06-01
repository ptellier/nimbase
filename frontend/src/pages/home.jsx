import '../styles/home.css';
import NavBar from "../components/NavBar";

const Home = () => {
  return (
      <header className="App-header">
        <div style={{
          position:"absolute",
          width:"100vw",
          height:"100vh",
          backgroundImage: `url(${process.env.PUBLIC_URL + '/img/unsplash_cloud_background.jpg'})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}>
          <NavBar />
          <div style={{margin:"auto", width: "100%"}}>
            <h1 id="title" className="red-brick-gradient-text"> Nimbase </h1>
            <h1 id="subtitle">Your base in the Cloud</h1>
            <h3 id="subsubtitle">No hassle serverless hosting of</h3>
            <h3 id="subsubtitle">your containerized web application</h3>
          </div>
        </div>
      </header>
  );
}

export default Home;