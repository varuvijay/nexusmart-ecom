"use client";

import { useId, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  XIcon,
  UserIcon,
  MailIcon,
  LockIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Modal from "react-modal";
import Link from "next/link";
import Otp from "@/components/mainComponents/Otp";
import Image from "next/image";
import { useToast } from "@/app/context/ToastContext";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  adminSiginUp,
  customerSiginUp,
  getOtp,
  merchantSiginUp,
  sendOtp,
} from "@/lib/api/login-register.js";
import { usePathname, useRouter } from "next/navigation";

const checkStrengthRequirements = (pass) => {
  const requirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[0-9]/, text: "At least 1 number" },
    { regex: /[a-z]/, text: "At least 1 lowercase letter" },
    { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    { regex: /[!@#$%^&*(),.?":{}|<>]/, text: "At least 1 special character" },
  ];
  return requirements.map((req) => ({
    met: req.regex.test(pass),
    text: req.text,
  }));
};

const getStrengthScore = (requirements) =>
  requirements.filter((req) => req.met).length;

const getStrengthColor = (score) => {
  if (score === 0) return "bg-border";
  if (score <= 2) return "bg-red-500";
  if (score <= 3) return "bg-orange-500";
  if (score <= 4) return "bg-amber-500";
  return "bg-emerald-500";
};

const getStrengthText = (score) => {
  if (score === 0) return "Enter a password";
  if (score <= 2) return "Weak password";
  if (score <= 3) return "Medium password";
  if (score <= 4) return "Strong password";
  return "Very strong password";
};

const CustomerSiginUp = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emaill, setEmaill] = useState("");
  const [activeStep, setActiveStep] = useState(1);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const pathname = usePathname();
  const accountType = pathname.includes("merchant")
    ? "merchant"
    : pathname.includes("admin")
    ? "admin"
    : "customer";

  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "20px",
      borderRadius: "12px",
      border: "none",
      maxWidth: "90%",
      width: "400px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 1000,
    },
  };

  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const termsId = useId();

  const [isVisible, setIsVisible] = useState(false);
  const [passRequirementsVisible, setPassRequirementsVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    control,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      terms: false,
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");
  const emailValue = watch("email");

  const passwordRequirements = useMemo(
    () => checkStrengthRequirements(passwordValue || ""),
    [passwordValue]
  );
  const passwordScore = useMemo(
    () => getStrengthScore(passwordRequirements),
    [passwordRequirements]
  );

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  const togglePasswordRequirements = () =>
    setPassRequirementsVisible((prev) => !prev);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const onSubmit = async (data) => {
    console.log("Signup Submitted (Validated Data):", data);
    if (!emailVerified) {
      setSubmitError("Email not verified. Please verify your email first.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let response;

      if (pathname === "/signup/customer") {
        response = await customerSiginUp(data);
      } else if (pathname === "/signup/merchant") {
        response = await merchantSiginUp(data);
      } else if (pathname === "/signup/admin") {
        response = await adminSiginUp(data);
      } else {
        response = await customerSiginUp(data);
      }

      console.log(response);

      if (response?.data?.message === "account has been created") {
        showToast({
          title: "Success!",
          description: "Account created successfully! Redirecting to login...",
          type: "success",
        });
        router.push("/login");
      } else {
        setSubmitError(
          "Signup successful but received unexpected response format."
        );
      }
    } catch (err) {
      console.error("Signup failed:", err);
      const errorMessage =
        err.response?.data?.message || "Signup failed. Please try again.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendEmail = async (email, event) => {
    if (event) {
      event.stopPropagation();
    }
    console.log("Sending email to:", email);
    try {
      setEmaill(email);
      let data = {
        email: email,
      };
      const response = await getOtp(data);
      console.log(response);
    } catch (err) {
      console.error("Failed to send OTP:", err);
    }
  };

  const handleOtpSubmitSuccess = async (otpData) => {
    console.log("OTP Submitted Successfully:", otpData);
    const data = { email: emaill };

    const response = await sendOtp(otpData, data);
    console.log(response);

    if (response.data.otpVerification === "true") {
      setEmailVerified(true);
      closeModal();
    }
  };

  const showVerifyButton =
    !emailVerified && !isModalOpen && !errors.email && emailValue;

  const checkEmail = () => {
    if (!emailVerified) {
      showToast({
        title: "Email Not Verified",
        description:
          "Please verify your email address before creating an account.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-[90dvh] w-full  flex justify-center md:justify-between items-center p-4 md:p-8">
      {/* Left side content - Welcome message and benefits */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center px-8">
        <div className="max-w-md">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2 text-gray-900">
              Join Our Community
            </h1>
            <p className="text-gray-600 text-lg">
              Create an account to enjoy personalized shopping experiences,
              track your orders, and get exclusive offers.
            </p>
          </div>

          <div className="space-y-5 mb-8">
            <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
              <h3 className="font-semibold text-lg mb-2">
                Creating a {accountType} account
              </h3>
              <p className="text-gray-600">
                {accountType === "merchant"
                  ? "Set up your store and start selling products to customers worldwide."
                  : accountType === "admin"
                  ? "Gain access to administrative tools to manage the platform."
                  : "Browse products, make purchases, and track your orders with ease."}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm transition-all hover:shadow-md">
              <div className="bg-gray-100 p-2 rounded-full">
                <CheckIcon className="text-gray-800" size={20} />
              </div>
              <span className="font-medium">Fast and secure checkout</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm transition-all hover:shadow-md">
              <div className="bg-gray-100 p-2 rounded-full">
                <CheckIcon className="text-gray-800" size={20} />
              </div>
              <span className="font-medium">Order tracking and history</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm transition-all hover:shadow-md">
              <div className="bg-gray-100 p-2 rounded-full">
                <CheckIcon className="text-gray-800" size={20} />
              </div>
              <span className="font-medium">Personalized recommendations</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm transition-all hover:shadow-md">
              <div className="bg-gray-100 p-2 rounded-full">
                <CheckIcon className="text-gray-800" size={20} />
              </div>
              <span className="font-medium">Exclusive deals and offers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="w-full md:w-1/2 flex justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white border-0 sm:px-10 px-6 py-8 rounded-2xl flex-center shadow-xl transition-transform duration-200 focus-within:shadow-gray-100"
          noValidate
        >
          <div className="space-y-5">
            <div className="space-y-1">
              <Label htmlFor={nameId} className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <UserIcon size={18} />
                </div>
                <Input
                  id={nameId}
                  placeholder="Choose a username"
                  type="text"
                  className="pl-10"
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? `${nameId}-error` : undefined}
                  {...register("name", { required: "Username is required" })}
                />
              </div>
              {errors.name && (
                <p id={`${nameId}-error`} className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor={emailId} className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <MailIcon size={18} />
                </div>
                <Input
                  id={emailId}
                  placeholder="your.email@example.com"
                  type="email"
                  className="pl-10"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={
                    errors.email ? `${emailId}-error` : undefined
                  }
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email ? (
                <p
                  id={`${emailId}-error`}
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.email.message}
                </p>
              ) : (
                <div>
                  {showVerifyButton && (
                    <div
                      className="flex items-center mt-1 text-blue-600 text-sm cursor-pointer hover:text-gray-600"
                      onClick={(e) => {
                        sendEmail(emailValue, e);
                        openModal();
                        setActiveStep(2);
                      }}
                    >
                      <ShieldCheckIcon
                        size={16}
                        className="mr-1 text-blue-500 underline underline-offset-4"
                      />
                      Verify Email
                    </div>
                  )}

                  {emailVerified && (
                    <div className="flex items-center mt-1 text-green-600 text-sm">
                      <CheckIcon size={16} className="mr-1" />
                      Email Verified Successfully!
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <div className="mb-2 space-y-1">
                <Label htmlFor={passwordId} className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <LockIcon size={18} />
                  </div>
                  <Input
                    id={passwordId}
                    className="pl-10 pr-10"
                    placeholder="Create a strong password"
                    type={isVisible ? "text" : "password"}
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={
                      errors.password
                        ? `${passwordId}-error`
                        : `${passwordId}-strength-desc ${passwordId}-reqs-list`
                    }
                    {...register("password", {
                      required: "Password is required",
                      validate: {
                        hasMinimumRequirements: (value) =>
                          getStrengthScore(
                            checkStrengthRequirements(value || "")
                          ) !== 4 || "Password must meet all requirements",
                      },
                    })}
                    onFocus={() => setActiveStep(3)}
                  />
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    className="text-gray-500 hover:text-gray-700 absolute inset-y-0 right-0 flex items-center pr-3 transition-colors outline-none"
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    aria-pressed={isVisible}
                    aria-controls={passwordId}
                  >
                    {isVisible ? (
                      <EyeOffIcon size={18} aria-hidden="true" />
                    ) : (
                      <EyeIcon size={18} aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p
                    id={`${passwordId}-error`}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="mb-3 space-y-1">
                <Label
                  htmlFor={confirmPasswordId}
                  className="text-sm font-medium"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <LockIcon size={18} />
                  </div>
                  <Input
                    id={confirmPasswordId}
                    placeholder="Confirm your password"
                    type="password"
                    className="pl-10"
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    aria-describedby={
                      errors.confirmPassword
                        ? `${confirmPasswordId}-error`
                        : undefined
                    }
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === passwordValue || "Passwords do not match",
                    })}
                  />
                </div>
                {errors.confirmPassword && (
                  <p
                    id={`${confirmPasswordId}-error`}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div
                className="bg-gray-100 mt-1 mb-2 h-2 w-full overflow-hidden rounded-full"
                role="progressbar"
                aria-valuenow={passwordScore}
                aria-valuemin={0}
                aria-valuemax={4}
                aria-label="Password strength"
              >
                <div
                  className={`h-full ${getStrengthColor(
                    passwordScore
                  )} transition-all duration-500 ease-out`}
                  style={{ width: `${(passwordScore / 4) * 100}%` }}
                ></div>
              </div>

              <button
                type="button"
                id={`${passwordId}-strength-desc`}
                className="text-gray-700 mb-2 text-sm font-medium text-left w-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded px-1 py-0.5 transition-colors"
                onClick={togglePasswordRequirements}
                aria-expanded={!passRequirementsVisible}
                aria-controls={`${passwordId}-reqs-list`}
              >
                <span className="flex justify-between gap-5">
                  <span>
                    {getStrengthText(passwordScore)}
                  </span>
                  <span className="text-blue-500">Requirements (
                    {passRequirementsVisible ? "Hide" : "Show"}):</span>
                </span>
              </button>

              <ul
                id={`${passwordId}-reqs-list`}
                className={`space-y-1.5 bg-gray-50 p-3 rounded-lg mb-4 ${
                  passRequirementsVisible ? "" : "hidden"
                }`}
                aria-label="Password requirements"
              >
                {passwordRequirements.map((req, index) => (
                  <li key={index} className={`flex items-center gap-2`}>
                    {req.met ? (
                      <CheckIcon
                        size={16}
                        className="text-green-500 flex-shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <XIcon
                        size={16}
                        className="text-gray-400 flex-shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={`text-sm ${
                        req.met ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      {req.text}
                      <span className="sr-only">
                        {req.met
                          ? " - Requirement met"
                          : " - Requirement not met"}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Controller
              name="terms"
              control={control}
              rules={{ required: "You must accept the Terms and Conditions" }}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <div className="flex items-start space-x-2 mt-2">
                    <Checkbox
                      id={termsId}
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) setActiveStep(4);
                      }}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      aria-invalid={fieldState.error ? "true" : "false"}
                      aria-describedby={
                        fieldState.error ? `${termsId}-error` : undefined
                      }
                      className="mt-1"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor={termsId}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms-and-conditions"
                          className="font-medium text-blue-800 underline underline-offset-4 hover:text-gray-600"
                        >
                          Terms and Conditions
                        </Link>
                      </Label>
                    </div>
                  </div>
                  {fieldState.error && (
                    <p
                      id={`${termsId}-error`}
                      className="text-red-500 text-xs mt-1"
                    >
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Display form submission error if any */}
            {submitError && (
              <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-100 rounded-lg">
                <div className="flex items-start">
                  <XIcon size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              </div>
            )}

            <div
              className="flex flex-col gap-4 mt-6"
              onClick={() => checkEmail()}
            >
              <Button
                type="submit"
                disabled={!isValid || !emailVerified || isSubmitting}
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="text-center">
                <span className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-gray-800 hover:text-gray-600 font-medium"
                  >
                    Log in
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* The Modal component */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="OTP Verification Modal"
        ariaHideApp={false}
      >
        <div className="relative">
          <button
            onClick={closeModal}
            className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close Modal"
          >
            <XIcon size={20} />
          </button>

          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
              <MailIcon size={24} className="text-gray-800" />
            </div>
            <h3 className="text-lg font-bold">Email Verification</h3>
            <p className="text-gray-600 text-sm mt-1">
              We've sent a verification code to {emaill}
            </p>
          </div>

          <Otp onOtpSubmitSuccess={handleOtpSubmitSuccess} />
        </div>
      </Modal>
    </div>
  );
};

export default CustomerSiginUp;
