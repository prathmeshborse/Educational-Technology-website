import { toast } from "react-hot-toast"

// import { setLoading, setToken } from "../../slices/authSlice"
import { setLoading, setToken } from "../../slice/authSlice";

import { resetCart } from "../../slice/cartSlice";

import { setUser } from "../../slice/profileSlice"
import { apiConnector } from "../apiconnector"
import { endpoints } from "../apis"

const { SENDOTP_API, SIGNUP_API, LOGIN_API, RESETPASSTOKEN_API, RESETPASSWORD_API } = endpoints;


export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      console.log("SENDOTP API RESPONSE............", response)

      console.log(response.data.success)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } 
    catch (error) {
      console.log("SENDOTP API ERROR............", error);
      toast.error("Could Not Send OTP or Email already registered");
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}



export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}



export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successful")
      const user = response.data.user;

      dispatch(setToken(user.token));

      const userImage = user.additionalDetails?.imageURL || `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`;

      dispatch(setUser({ ...user, image: userImage }));

      localStorage.setItem("token", JSON.stringify(user.token));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, image: userImage })
      );
      navigate("/dashboard/my-profile");
      // navigate("/");
      
    } catch (error) {
      console.log("LOGIN API ERROR:", error);
      console.log("MESSAGE:", error.message);
      toast.error(error.message);
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}



export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  }
}



export function getPasswordResetToken(email , setEmailSent) {
  return async(dispatch) => {
    dispatch(setLoading(true));

    try{
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {email});

      console.log("RESET PASSWORD TOKEN RESPONSE....", response);

      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    }
    catch(error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Failed to send email for resetting password");
    }

    dispatch(setLoading(false));
  }
};



export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector( "POST", RESETPASSWORD_API, { password, confirmPassword, token });

      console.log("RESET Password RESPONSE ... ", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password has been reset successfully");

        setTimeout(() => {
            navigate("/login");
        }, 2000);
    } catch (error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Unable to reset password");
    }

    dispatch(setLoading(false));
  };
}