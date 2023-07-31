import NavBar from "../components/NavBar";
import '../styles/page404.css';

const Page404 = () => {
  return (
    <div className="background-image" style={{height: "100vh"}}>
      <NavBar/>
      <div className="center-in-page">
        <h1 className="red-brick-gradient-text title-404" style={{fontFamily: "monospace", fontSize: "3em"}}>404</h1>
        <h2 className="red-brick-gradient-text title-404">Could Not find the page you are looking for</h2>
      </div>
    </div>
  )
}

export default Page404;
