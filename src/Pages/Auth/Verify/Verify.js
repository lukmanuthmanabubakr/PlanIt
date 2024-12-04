import React from "react";
import "./Verify.css";
import { RESET, verifyUser } from "../../../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/Loader/Loader";
import { useParams } from "react-router-dom";
import ButtonLoader from "../../../components/ButtonLoader/ButtonLoader";
const Verify = () => {
  const dispatch = useDispatch();
  const { verificationToken } = useParams();

  const { isLoading } = useSelector((state) => state.auth);

  const verifyAccount = async () => {
    await dispatch(verifyUser(verificationToken));
    await dispatch(RESET());
  };

  return (
    <>
      <div className="verifyAccount">
        <h2>Account Verification</h2>
        <p>To verify your account, click the button bellow</p>

        <ButtonLoader
          isLoading={isLoading}
          onClick={verifyAccount}
          className="vAccount"
        >
          Verify Account
        </ButtonLoader>
      </div>
    </>
  );
};

export default Verify;
