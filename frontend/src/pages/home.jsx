import '../styles/home.css';
import NavBar from "../components/NavBar";
import {Heading} from "@chakra-ui/react";

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
          backgroundPosition: "center bottom",
        }}>
          <NavBar />
          <div style={{margin:"auto", width: "100%"}}>
            <Heading as="h1" id="title" className="red-brick-gradient-text"
                     fontSize={{base: '48px', sm: '56px', md: '64px'}}> Nimbase </Heading>
            <Heading as="h2" id="subtitle"
                     fontSize={{base: '24px', sm: '32px', md: '48px'}}>Your base in the Cloud</Heading>
            <Heading as="h3" id="subsubtitle"
                     fontSize={{base: '16px', sm: '18px', md: '24px'}}>No hassle serverless hosting of</Heading>
            <Heading as="h3" id="subsubtitle"
                     fontSize={{base: '16px', sm: '18px', md: '24px'}}>your containerized web application</Heading>
          </div>
        </div>
      </header>
  );
}

export default Home;