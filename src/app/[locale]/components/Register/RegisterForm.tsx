"use client";

import RegisterForm_Desktop from "./RegisterForm_Desktop";
import RegisterForm_Mobile from "./RegisterForm_Mobile";

const RegisterForm = () => {
  return (
    <>
      <div className="hidden lg:block">
        <RegisterForm_Desktop />
      </div>
      
      <div className="lg:hidden">
        <RegisterForm_Mobile />
      </div>
    </>
  );
};

export default RegisterForm;
