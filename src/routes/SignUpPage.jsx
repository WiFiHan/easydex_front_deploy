import { useState } from "react";
import { SignUpForm } from "../components/Form";
import { signUp } from "../apis/api";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    username: "",
    college: "",
    major: "",
  });

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    signUp(formData);
  };

  return (
    <div>
      <div className="flex flex-col items-center my-[100px]">
        <h3 className="font-bold text-4xl font-sans uppercase">
          Easy Sign Up<br></br>
        </h3>
        <SignUpForm
          formData={formData}
          setFormData={setFormData}
          handleSignUpSubmit={handleSignUpSubmit}
        />
      </div>
    </div>
  );
};

export default SignUpPage;