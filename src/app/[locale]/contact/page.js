/* eslint-disable jsx-a11y/alt-text */
"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import React, { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { ArrowIcon } from "@/components";
import { useContact } from "../../../hooks/useContact";
import { createContactForm } from "../../../lib/api";

export default function ContactPage() {
  const [showOverlay, setShowOverlay] = useState(false);

  const [formData, setFormData] = useState({
    FirstName: "",
    lastname: "",
    email: "",
    phonenumber: "",
    message: "",
    privacy: false,
  });
  const [formError, setFormError] = useState({
    FirstName: "",
    lastname: "",
    email: "",
    phonenumber: "",
    message: "",
    privacy: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate
    const errors = { FirstName: "", lastname: "", email: "", message: "" };
    if (!formData.FirstName) errors.FirstName = "First name is required";
    if (!formData.lastname) errors.lastname = "Last name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.phonenumber)
      errors.phonenumber = "phonenumber Number is required";
    if (!formData.message) errors.message = "Message is required";
    if (!formData.privacy)
      errors.privacy = "You must accept the Privacy Policy";
    setFormError(errors);

    if (
      errors.FirstName ||
      errors.lastname ||
      errors.email ||
      errors.message ||
      errors.phonenumber ||
      errors.privacy
    ) {
      console.log("erroes if 1", errors);
      return;
    }

    try {
      console.log("Sending to Strapi API...");
      console.log("DEBUG sending formData:", formData);
      await createContactForm(formData);
      setFormData({
        FirstName: "",
        lastname: "",
        email: "",
        phonenumber: "",
        message: "",
        privacy: false,
      });

      setShowOverlay(true);
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  const { contactData, loading, error } = useContact();

  if (loading) return <div>Loading contact info...</div>;
  if (error) return <div>Error loading contact info</div>;

  const contactForm = contactData?.ContactForm;

  return (
    <div className="text-black bg-white w-full pb-[80px]">
      {/* ---------------- HERO ---------------- */}
      <div
        className=" absolute w-full md:aspect-[2/1] lg:aspect-[2/1] xl:aspect-[2/1] aspect-[1/1] bg-cover bg-center flex flex-col justify-center items-center text-center"
        style={{ backgroundImage: "url('/images/contact-bg.png')" }}
      ></div>
      <div className="mt-[96px] w-full relative z-20  flex  justify-center items-center flex-col text-center">
        <div className="mt-[56px]">
          <h1 className="text-[56px] text-white font-bold ">Contact Us</h1>
          <p className="text-[20px] text-white mt-2  font-light px-4">
            Get in touch with our team. We&apos;re here to help you with any
            questions or inquiries.
          </p>
        </div>
      </div>

      {/* ---------------- FORM & PANEL ---------------- */}
      <div className="relative z-20  flex flex-col lg:flex-row w-full px-[32px] md:px-[64px] justify-center items-stretch gap-[32px]">
        {/* LEFT FORM */}
        <div
          className="w-full max-w-[864px] mt-[32px] 
             rounded-[16px] bg-[rgba(255,255,255,0.90)] 
             shadow-[0_16px_64px_0_rgba(0,0,0,0.12)] 
             backdrop-blur-[24px] min-h-[770px]"
        >
          <div className="py-10 px-8 md:px-16">
            <h2 className="text-[#E60000] text-[32px] pb-[32px] font-bold">
              Send us a Message
            </h2>

            <form
              className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2"
              onSubmit={handleSubmit}
              onSubmitCapture={(e) => {
                console.log("Form onSubmitCapture triggered");
              }}
            >
              {/* First Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-black"
                >
                  First Name <span className="text-[#E60000]">*</span>
                </label>
                <input
                  type="text"
                  id="FirstName"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="mt-1 w-full border border-black px-4 py-3 outline-none focus:ring-2 focus:ring-[#E60000]"
                />
                {formError.FirstName && (
                  <p className="text-red-600 text-sm mt-1">
                    {formError.FirstName}
                  </p>
                )}
              </div>
              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium text-black"
                >
                  Last Name <span className="text-[#E60000]">*</span>
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="mt-1 w-full border border-black px-4 py-3 outline-none focus:ring-2 focus:ring-[#E60000]"
                />
                {formError.lastname && (
                  <p className="text-red-600 text-sm mt-1">
                    {formError.lastname}
                  </p>
                )}
              </div>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black"
                >
                  Email Address <span className="text-[#E60000]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="mt-1 w-full border border-black px-4 py-3 outline-none focus:ring-2 focus:ring-[#E60000]"
                />
                {formError.email && (
                  <p className="text-red-600 text-sm mt-1">{formError.email}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phonenumber"
                  className="block text-sm font-medium text-black"
                >
                  Phone Number <span className="text-[#E60000]">*</span>
                </label>
                <input
                  type="text"
                  id="phonenumber"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  placeholder="Phone Number ex.0991234567"
                  className="mt-1 w-full border border-black px-4 py-3 outline-none focus:ring-2 focus:ring-[#E60000]"
                />
                {formError.phonenumber && (
                  <p className="text-red-600 text-sm mt-1">
                    {formError.phonenumber}
                  </p>
                )}
              </div>
              {/* Message */}
              <div className="md:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-black"
                >
                  Message / Description
                  <span className="text-[#E60000]">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Message / Description"
                  className="mt-1 w-full border border-black px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-[#E60000]"
                />
                {formError.message && (
                  <p className="text-red-600 text-sm mt-1">
                    {formError.message}
                  </p>
                )}
              </div>
              <FileDrop />
              {/* Checkbox */}
              <div className="md:col-span-2 text-[16px]">
                <label
                  className="flex items-start space-x-2 cursor-pointer"
                  onClick={(e) => {
                    // ถ้า click ที่ <a> ให้ไปหน้า ไม่ toggle
                    if (e.target.tagName.toLowerCase() === "a") return;
                    setFormData((prev) => ({
                      ...prev,
                      privacy: !prev.privacy, // toggle checkbox
                    }));
                  }}
                >
                  <input
                    type="checkbox"
                    name="privacy"
                    checked={formData.privacy} // bind state
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        privacy: !prev.privacy,
                      }))
                    }
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#E60000] focus:ring-[#E60000]"
                  />
                  <span className="text-sm text-gray-700">
                    I have read and accepted terms and conditions specified in
                    the{" "}
                    <a
                      href="/privacy-policy"
                      className="text-[#E60000] font-bold underline"
                      onClick={(e) => e.stopPropagation()} // ป้องกัน toggle
                    >
                      Privacy Policy
                    </a>{" "}
                    and do hereby consent to the collecting, processing and/or
                    disclosing of the personal data provided by me to fulfil the
                    above-said purposes.
                  </span>
                </label>
              </div>

              {formError.privacy && (
                <p className="text-red-600 text-sm mt-1">{formError.privacy}</p>
              )}
              {/* Submit */}
              <div className="md:col-span-2 ">
                <button
                  type="submit"
                  className="w-full bg-[#E60000] cursor-pointer py-3.5 rounded-[100px] text-white font-medium hover:bg-[#cc0000]"
                >
                  <div className="flex flex-row justify-center">
                    <span className="pr-2">Submit</span>
                    <ArrowIcon width={24} height={24}></ArrowIcon>
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="w-full max-w-[864px] lg:max-w-[416px]  mt-[32px] min-h-[770px] rounded-[16px] bg-[rgba(23,25,31,0.90)] 
             shadow-[0_16px_64px_0_rgba(0,0,0,0.12)] backdrop-blur-[24px]
             mx-auto  
             "
        >
          <div className="py-10 px-16">
            <h2 className="text-white font-bold text-[24px]">Get in Touch</h2>
            <div className="py-8">
              <div className="w-full h-[264px] my-[32px]">
                <iframe
                  className="w-full h-full rounded-[8px]"
                  src={contactForm?.MapAddress}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className=" flex flex-row">
                <img
                  src={"/images/localtion.png"}
                  className=" object-cover w-[32px] h-[32px]"
                ></img>
                <div className="flex flex-col pl-[26px]">
                  <span className="block font-bold text-white">Location</span>
                  <p className="text-white/70">{contactForm?.Address}</p>
                </div>
              </div>
              <div className=" flex flex-row pl-[5px]">
                <img
                  src={"/images/phone.png"}
                  className=" object-cover w-[24px] h-[32px]"
                ></img>
                <div className="flex flex-col pl-[26px]">
                  <span className="block font-bold text-white">Telephone</span>
                  <p className="text-white/70">{contactForm?.Phonenumber}</p>
                </div>
              </div>
              <div className=" flex flex-row pl-[2px]">
                <img
                  src={"/images/mail.png"}
                  className=" object-cover w-[32px] h-[32px]"
                ></img>
                <div className="flex flex-col pl-[26px]">
                  <span className="block font-bold text-white">Email</span>
                  <p className="text-white/70">{contactForm?.email}</p>
                </div>
              </div>
              <div className=" flex flex-row pl-[2px]">
                <img
                  src={"/images/clock.png"}
                  className=" object-cover w-[32px] h-[32px]"
                ></img>
                <div className="flex flex-col pl-[26px]">
                  <span className="block font-bold text-white">
                    {" "}
                    Business Hours
                  </span>
                  <p className="text-white/70">{contactForm?.Time}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- OVERLAY ---------------- */}
      {showOverlay && (
        <div className="fixed z-50 inset-0 flex items-center justify-center  bg-black/50">
          <div className="bg-white p-8 rounded-[16px]  text-center w-[344px] md:w-[490px] xl:w-[490px]   ">
            <img
              src={"/images/formsubmit.png"}
              alt="form"
              className=" object-cover w-24 h-24 mx-auto"
            ></img>
            <h1 className=" py-2 text-[32px] font-bold text-[#E60000]">
              Message Sent
            </h1>
            <p className="text-black text-[16px]">
              Thank you for contacting us. We will reply to you shortly.
            </p>
            <div className="pt-8">
              <button
                onClick={() => setShowOverlay(false)}
                className="bg-red-600 text-white px-12 w-[192px] cursor-pointer rounded-[100px] py-3.5 "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
