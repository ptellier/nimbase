import NavBar from "../components/NavBar";
import '../styles/signup.css';
import {useState} from "react";

const Signup = () => {
    const [formData, setFormData] = useState(   {
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
        firstName: "",
        lastName: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault()
        console.log("Form submitted");
    }

    return (
    <div className="background-image">
      <NavBar/>
        <div className={"signup-container"}>
            <div className={"signup-box"}>
                <form className={"signup-form"} onSubmit={handleSubmit}>
                    <h2>Sign Up</h2>
                    <div className={"firstname field-div"}>
                        <span style={{display:"inline-block", width:"0.5em"}}/>
                        <label htmlFor="firstName"> First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={"field-div"}>
                        <span style={{display:"inline-block", width:"0.5em"}}/>
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type={"text"}
                            id={"lastName"}
                            name={"lastName"}
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={"field-div"}>
                        <span style={{display:"inline-block", width:"0.5em"}}/>
                        <label htmlFor="username">Username:</label>
                        <input
                            type={"text"}
                            id={"username"}
                            name={"username"}
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={"field-div"}>
                        <span style={{display:"inline-block", width:"0.5em"}}/>
                        <label htmlFor="email">Email:</label>
                        <input
                            type={"email"}
                            id={"email"}
                            name={"email"}
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={"field-div"}>
                        <span style={{display:"inline-block", width:"0.5em"}}/>
                        <label htmlFor="email">Password:</label>
                        <input
                            type={"password"}
                            id={"password"}
                            name={"password"}
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={"field-div"}>
                        <span style={{display:"inline-block", width:"0.5em"}}/>
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            type={"password"}
                            id={"confirmPassword"}
                            name={"confirmPassword"}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <div style={{width:"max-content", marginLeft:"auto", marginRight:"auto", marginTop:"20px"}}>
                            <button type={"submit"}>Sign Up</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}

export default Signup;