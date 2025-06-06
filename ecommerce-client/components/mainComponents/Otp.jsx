"use client"; // Keep this directive

import { useId, useState, useEffect } from "react";
import { OTPInput } from "input-otp";
import { MinusIcon, ClockIcon, RefreshCwIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

function Slot(props) {
  const { char, hasFakeCaret, isActive } = props;

  return (
    <div
      className={cn(
        "relative flex size-12 items-center justify-center rounded-md border border-input bg-background text-lg font-semibold shadow-sm transition-all duration-200",
        { 
          "border-primary ring-2 ring-primary/30 z-10": isActive,
          "border-gray-300": !isActive && !char,
          "border-green-500": !isActive && char
        }
      )}
    >
      {char != null && <div>{char}</div>}
      {hasFakeCaret && (
         <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="animate-caret-blink h-5 w-0.5 bg-primary" />
         </div>
      )}
    </div>
  );
}

export default function Otp({ onOtpSubmitSuccess, email }) {
  const id = useId();
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      otp: "",
    },
  });

  // Add countdown timer for resend functionality
  const [countdown, setCountdown] = useState(30);
  const [isResendActive, setIsResendActive] = useState(false);

  useEffect(() => {
    if (countdown > 0 && !isResendActive) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isResendActive) {
      setIsResendActive(true);
    }
  }, [countdown, isResendActive]);

  const handleResendOtp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset the countdown
    setCountdown(30);
    setIsResendActive(false);
    
    // You would add your resend OTP logic here
    console.log("Resending OTP...");
    
    // Optional: Clear the current OTP input
    reset({ otp: "" });
  };

  const onSubmit = (data, event) => {
    event.stopPropagation();
    event.preventDefault();
    
    console.log("OTP Form Submitted:", data);
    
    if (onOtpSubmitSuccess) {
      onOtpSubmitSuccess(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="text-center mb-2">
        <Label htmlFor={id} className="text-base font-medium">
          Enter Verification Code
        </Label>
        <p className="text-gray-500 text-sm mt-1">
          Please enter the 6-digit code sent to {email ? email : "your email"}
        </p>
      </div>

      <Controller
        name="otp"
        control={control}
        rules={{
          required: "Verification code is required",
          minLength: {
            value: 6,
            message: "Please enter all 6 digits"
          },
          maxLength: {
            value: 6,
            message: "Please enter all 6 digits"
          }
        }}
        render={({ field, fieldState }) => (
          <div className="space-y-3">
            <OTPInput
              id={id}
              containerClassName="flex items-center justify-center gap-2 has-disabled:opacity-50"
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
              ref={field.ref}
              render={({ slots }) => (
                <>
                  <div className="flex gap-2">
                    {slots.slice(0, 3).map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>

                  <div className="text-gray-400">
                    <MinusIcon size={20} aria-hidden="true" />
                  </div>

                  <div className="flex gap-2">
                    {slots.slice(3).map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>
                </>
              )}
            />
            {fieldState.error && (
              <div className="text-red-500 text-xs text-center">
                {fieldState.error.message}
              </div>
            )}
          </div>
        )}
      />

      <div className="flex flex-col items-center space-y-4">
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Didn't receive the code?{" "}
            {isResendActive ? (
              <button
                type="button"
                className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-sm"
                onClick={handleResendOtp}
              >
                <span className="flex items-center">
                  <RefreshCwIcon size={14} className="mr-1" />
                  Resend Code
                </span>
              </button>
            ) : (
              <span className="text-gray-400 flex items-center">
                <ClockIcon size={14} className="mr-1" />
                Resend in {countdown}s
              </span>
            )}
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
        >
          Verify
        </button>
      </div>
    </form>
  );
}