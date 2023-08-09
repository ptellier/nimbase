import NavBar from "../components/NavBar";
import '../styles/signup.css';
import {useEffect, useState} from "react";
import Field from "../components/Field";
import {useDispatch, useSelector} from "react-redux";
import {signup, signupErrorMessageSelector} from "../state/userSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import {Button, Heading} from "@chakra-ui/react";

// REFERENCE: regex for password/email validation generated with chatGPT
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Signup = () => {
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const errorMessage = useSelector(signupErrorMessageSelector);
    const navigate = useNavigate();

    const dispatch = useDispatch();

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

    useEffect(() => {
        if (submitAttempted) {
            validateFormData();
        }
    }, [formData]);



    const validateFormData = () => {
        let valid = true;
        if (formData.firstName === "") {setFirstNameError("Cannot be blank"); valid = false;} else {setFirstNameError(false);}
        if (formData.lastName === "") {setLastNameError("Cannot be blank"); valid = false;} else {setLastNameError(false);}
        if (formData.username === "") {setUsernameError("Cannot be blank"); valid = false;} else {setUsernameError(false);}

        if (formData.email === "") {
            setEmailError("Cannot be blank"); valid = false;
        } else if (emailRegex.test(formData.email) === false) {
            setEmailError("Email is not valid"); valid = false;
        } else {setEmailError(false);}

        if (formData.password === "") {
            setPasswordError("Cannot be blank"); valid = false;
        } else if (passwordRegex.test(formData.password) === false) {
            setPasswordError("Password must be at least 8 characters long, and have a lowercase letter (a-z), an uppercase letter (A-Z), and a number (0-9)"); valid = false;
        } else {setPasswordError(false);}

        if (formData.confirmPassword === "") {
            setConfirmPasswordError("Cannot be blank"); valid = false;
        } else if (formData.confirmPassword !== formData.password) {
            setConfirmPasswordError("Passwords do not match"); valid = false;
        } else {setConfirmPasswordError(false);}

        return valid;
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitAttempted(true);
        const isValid = validateFormData();
        if (!isValid) {return;}
        try {
            console.log("Dispatching signup action")
            dispatch(signup({
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email,
                password: formData.password
            })).then((response) => {
                if (response.payload) {
                    navigate("/");
                }
            });
        } catch (error) {
            console.error("Error creating user:", error);
        }
        console.log("Form submitted");
    }

    return (
    <div className="background-image">
      <NavBar/>
        <div className={"signup-container"}>
            <div className={"signup-box"}>
                <form className={"signup-form"} onSubmit={handleSubmit}>
                    <Heading as="h1" fontSize="32px" fontWeight={500} mb="20px" align="center">Sign Up</Heading>

                    {(errorMessage) ?
                      <div className="error-text"><FontAwesomeIcon icon={faTriangleExclamation} /> {errorMessage}</div>
                      :
                      null}

                    <Field label="First Name" type="text" name="firstName" value={formData.firstName}
                           onChange={handleInputChange} error={firstNameError} autoComplete="given-name"/>
                    <Field label="Last Name" type="text" name="lastName" value={formData.lastName}
                           onChange={handleInputChange} error={lastNameError} autoComplete="family-name"/>
                    <Field label="Username" type="text" name="username" value={formData.username}
                           onChange={handleInputChange} error={usernameError} autoComplete="username"/>
                    <Field label="Email" type="text" name="email" value={formData.email}
                           onChange={handleInputChange} error={emailError} autoComplete="email"/>
                    <Field label="Password" type="password" name="password" value={formData.password}
                           onChange={handleInputChange} error={passwordError} autoComplete="new-password"/>
                    <Field label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword}
                           onChange={handleInputChange} error={confirmPasswordError} autoComplete="new-password"/>

                    <div>
                        <div style={{width:"max-content", marginLeft:"auto", marginRight:"auto", marginTop:"20px"}}>
                            <Button variant="customDefault"  type={"submit"}>Sign Up</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}

export default Signup;