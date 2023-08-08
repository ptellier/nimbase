import '../styles/home.css';
import NavBar from "../components/NavBar";
import {Button, Heading, HStack, Text, VStack} from "@chakra-ui/react";
import NimbaseIcon from "../static/svg/nimbase_icon.svg";

const Home = () => {
  function onClickGetStared() {
    window.location.href = "/login";
  }

  return (
      <header className="App-header">
        <div style={{
          width:"100vw",
          height:"100vh",
          backgroundImage: `url(${process.env.PUBLIC_URL + '/img/unsplash_cloud_background.jpg'})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
        }}>
          <NavBar />
          <div style={{margin:"auto", width: "100%"}}>
            <Heading as="h1" className="title red-brick-gradient-text" fontWeight={700}
                     fontSize={{base: '48px', sm: '56px', md: '64px'}}> Nimbase </Heading>
            <Heading as="h2" className="sub-title" fontWeight={400}
                     fontSize={{base: '24px', sm: '32px', md: '48px'}}>Your base in the Cloud</Heading>
            <Heading as="h3" className="sub-sub-title" fontWeight={400}
                     fontSize={{base: '16px', sm: '18px', md: '24px'}}>No hassle serverless hosting of</Heading>
            <Heading as="h3" className="sub-sub-title" fontWeight={400}
                     fontSize={{base: '16px', sm: '18px', md: '24px'}}>your containerized web application</Heading>
          </div>
        </div>
        <section>
          <VStack spacing={2} align="left">
            <Heading as="h1" fontWeight={500}>A New Type of Hosting Service</Heading>
            <HStack>
              <Text as="p" className="section-text">
                Nimbase is a web application that lets anyone host any application that can be containerized with a docker file.
                Simply create an account, give Nimbase a link to your GitHub repository and upload a docker file.
                Then Nimbase will build your app, host it, and make it available from anywhere on the internet.
              </Text>
              <img width="300px" src={NimbaseIcon} alt="nimbase icon"/>
            </HStack>
            <Button onClick={onClickGetStared}>Get Started</Button>
          </VStack>
        </section>
      </header>
  );
}

export default Home;