import axiosInstance from "./axios.js";

// OTP related APIs
export const getOtp = (data) => axiosInstance.post("/otp", data);

export const sendOtp = (otp, email) =>
  axiosInstance.post(`/verifyOtp/${otp.otp}`, email);

// Registration APIs
export const customerSiginUp = (data) =>
  axiosInstance.post("/customer/register", data);

export const merchantSiginUp = (data) =>
  axiosInstance.post("/merchant/register", data);

export const adminSiginUp = (data) => {
  return axiosInstance.post("/admin/register", data);
};

// Authentication APIs
export const userLogin = (data) => {
  return axiosInstance.post("/login", data);
};

export const userLogout = (session) => {
  return axiosInstance.post("/logout", session, {
    headers: {
      sessionID: session,
    },
  });
};
