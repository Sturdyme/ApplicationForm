import React, { useEffect, useRef, useState } from 'react'
import bgImage from '../assets/dwell.png'
import logo from '../assets/logo.png'
import { FiUpload, FiUser } from 'react-icons/fi'
import { FaCamera, FaCheck, FaUpload, FaXmark } from 'react-icons/fa6'
import { AiOutlineMail } from 'react-icons/ai'
import { IoIosCalendar, IoIosPhonePortrait } from 'react-icons/io'
import { IoCloseCircle } from 'react-icons/io5'
import Webcam from 'react-webcam'
import { CiGlobe } from 'react-icons/ci'
import SignatureCanvas from "react-signature-canvas";
import ReviewItem from './ReviewItem';
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const Form = () => {
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);
  const resumeFileInputRef = useRef(null);
  const dateRef = useRef(null);
  const sigCanvas = useRef(null);

  const [fileName, setFileName] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [position, setPosition] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [uploadMethod, setUploadMethod] = useState("");
  const [reviewMode, setReviewMode] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [driversLicense, setDriversLicense] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const jobs = ["Appointment Scheduler", "Customer Service Representative", "Data Entry Analyst", "Data Entry Strategist", "Insurance Agent", "Payroll Assistant"];

  // Logic functions remain the same as your original
  const handleChooseFile = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setDriversLicense(file);
      setFileName(file.name);
      setCameraOpen(false);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setCapturedImage(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleChooseResumeFile = () => resumeFileInputRef.current.click();
  const handleResumeFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setResumeFile(file);
      setResumeFileName(file.name);
    }
  };

  const toggleCamera = () => { setCameraOpen(!cameraOpen); setCapturedImage(""); setFileName(""); };
  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setCameraOpen(false);
  };
  const clearSelection = () => { setFileName(""); setCapturedImage(""); setCameraOpen(false); };
  const openCalendar = () => dateRef.current?.showPicker();
  const clearDate = () => setDate("");
  const clearSignature = () => sigCanvas.current.clear();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();

  const formData = new FormData();
formData.append('first_name', firstName);   // NOT first_name
formData.append('last_name', lastName);
formData.append('email', email);
formData.append('dob', dob);
formData.append('phone', phone);
formData.append('position', position);
formData.append('employment', employmentStatus);
formData.append('address', address);
formData.append('city', city);
formData.append('state', state);
formData.append('zip', zipcode);
formData.append('drivers_license', driversLicense);
formData.append('resume_file', resumeFile);
formData.append('terms_accepted', termsAccepted ? 'on' : '');



  if (driversLicense) {
    formData.append("license_path", driversLicense);
  }

  if (resumeFile) {
    formData.append("resume_file", resumeFile);
  }

  if (sigCanvas.current) {
    formData.append("signature", sigCanvas.current.toDataURL());
  }

   try {
    const response = await fetch(`${API_URL}/api/applications`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },

      body: formData,
    });

    // Check if the response is actually JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response received:", text);
      throw new Error(`Server returned status ${response.status} (Not JSON). Check console.`);
    }

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || "Something went wrong ❌");
      console.log("Server Error Response:", data);
      return;
    }

    // ✅ SUCCESS TOAST
    toast.success("Application submitted successfully 🎉");
    console.log("Success:", data);
    setReviewMode(false);

  } catch (error) {
    console.error("Error:", error);
    toast.error(`Submission failed: ${error.message}`);
  }
};


  return (
    <section 
      className={`min-h-screen w-full bg-cover bg-fixed flex flex-col items-center px-4 sm:px-6 lg:px-8 space-y-12 overflow-x-hidden py-10 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundImage: `url(${bgImage})` }}>
      
      {/* Header Card */}
      <div className='flex justify-center text-center w-full max-w-[1600px]'>
        <div className='text-black text-center flex flex-col items-center justify-center shadow-lg min-h-[400px] w-full bg-white p-6'>
          <div className='flex flex-col items-center justify-center gap-1'>
            <img src={logo} alt="Dwell Care Logo" className='h-[200px] md:h-[300px] w-auto object-contain' />
            <p className='text-2xl md:text-4xl text-[#337131] font-bold'>Dwell Care Job Application Form</p>
            <p className='text-lg md:text-2xl'>Please fill in the form below to begin your application process.</p>
          </div>     
        </div>
      </div>

      {/* Name Input Section */}
      <div className='bg-white w-full max-w-[1600px] md:h-64 rounded-[20px] p-8 shadow-lg mx-auto opacity-90'>
        <div className='flex flex-col md:flex-row justify-between gap-8 md:px-10'>
          <div className='flex flex-col items-start space-y-4 w-full md:w-[700px]'>
            <div className='flex items-center gap-1'>
              <p className='text-gray-700 text-lg font-semibold'> Name</p>
              <p className='text-red-500'>*</p>
            </div>
            <div className='relative w-full'>
              <FiUser className='absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 text-2xl' />
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="border-b-2 border-gray-400 focus:border-green-500 outline-none pl-10 py-1 w-full" />
            </div>
            <p className='text-gray-700 font-light'>First Name</p>
            <p className='text-sm text-gray-500'>Enter a value for this field</p>
          </div>

          <div className='flex flex-col md:mt-11 items-start space-y-2 w-full md:w-[700px]'>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="border-b-2 border-gray-400 focus:border-green-500 outline-none px-2 py-1 w-full" />
            <p className='text-gray-700 font-light'>Last Name</p>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className='bg-white w-full max-w-[1600px] min-h-[350px] rounded-[20px] p-8 shadow-lg mx-auto opacity-90'> 
        <div className='flex flex-col items-start space-y-4 md:px-8'> 
          <div className='flex gap-1'>
            <p className='text-gray-700 text-lg font-semibold'>Address</p> 
            <p className='text-red-500'>*</p>
          </div>
        </div>
        <div className='mt-8 space-y-8 md:px-8'> 
          <div className='flex flex-col items-start space-y-2 w-full'>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="border-b-2 border-gray-400 focus:border-green-500 outline-none px-2 w-full" />
            <p className='text-gray-700 font-light'>Street Address</p>
          </div>
          <div className='flex flex-col items-start space-y-2 w-full'>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="border-b-2 border-gray-400 focus:border-green-500 outline-none px-2 py-1 w-full" />
            <p className='text-gray-700 font-light'>City</p>
          </div>
          <div className='flex flex-col md:flex-row justify-between gap-8'>
            <div className='flex flex-col items-start space-y-2 w-full md:w-[700px]'>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="border-b-2 border-gray-400 focus:border-green-500 outline-none px-2 py-1 w-full" />
              <p className='text-gray-700 font-light'>State</p>
            </div>
            <div className='flex flex-col items-start space-y-2 w-full md:w-[700px]'>
              <input type="text" value={zipcode} onChange={(e) => setZipcode(e.target.value)} className="border-b-2 border-gray-400 focus:border-green-500 outline-none px-2 py-1 w-full" />
              <p className='text-gray-700 font-light'>Zipcode</p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Section */}
      <div className='bg-white w-full max-w-[1600px] min-h-[150px] rounded-[20px] p-8 shadow-lg mx-auto opacity-90'> 
        <div className='flex md:px-8 items-center gap-1'>
          <p className='text-gray-700 text-lg font-semibold'>Email</p>
          <p className='text-red-500'>*</p>
        </div>
        <div className='relative w-full md:w-auto md:mx-8 mt-4'>
          <AiOutlineMail className='absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-2xl' />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-b-2 border-gray-400 focus:border-green-500 outline-none pl-12 py-2 w-full" />
        </div>
      </div>

      {/* Phone Section */}
      <div className='bg-white w-full max-w-[1600px] min-h-[150px] rounded-[20px] p-8 shadow-lg mx-auto opacity-90'> 
        <div className='flex md:px-8 items-center gap-1'>
          <p className='text-gray-700 text-lg font-semibold'>Phone</p>
          <p className='text-red-500'>*</p>
        </div>
        <div className='relative w-full md:w-auto md:mx-8 mt-4'>
          <IoIosPhonePortrait  className='absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-2xl' />
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className="border-b-2 border-gray-400 focus:border-green-500 outline-none pl-12 py-2 w-full" />
        </div>
      </div>

      {/* Date Of Birth Section */}
      <div className='bg-white w-full max-w-[1600px] min-h-[200px] rounded-[20px] p-8 shadow-lg mx-auto opacity-90'> 
        <div className='flex md:px-8 items-center gap-1'>
          <p className='text-gray-700 text-lg font-semibold'>Date Of Birth</p>
          <p className='text-red-500'>*</p>
        </div>
        <div className="w-full md:w-[700px] md:ml-8 mt-6 relative">
          <input ref={dateRef} type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="border-b-2 border-gray-300 focus:border-green-500 outline-none pr-16 pl-3 py-3 w-full text-gray-700" />
          <IoIosCalendar onClick={openCalendar} className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 text-xl cursor-pointer hover:text-green-500" />
          {date && <IoCloseCircle onClick={clearDate} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-lg cursor-pointer hover:text-red-500" />}
          <p className="text-sm text-gray-500 mt-2">Format: MM/DD/YYYY</p>
        </div>
      </div>

      {/* Driver's License Section */}
      <div className='bg-white w-full max-w-[1600px] min-h-[200px] rounded-[20px] flex flex-col justify-center p-8 shadow-lg mx-auto opacity-90'> 
        <div className='flex md:px-8 items-center gap-1 mb-4'>
          <p className='text-gray-700 text-lg font-semibold'>DRIVERS LICENSE OR STATE ID (FRONT)</p>
          <p className='text-red-500'>*</p>
        </div>
        <div className="w-full border-2 border-dotted border-gray-400 rounded-lg flex flex-col items-center justify-center bg-white shadow-sm p-4">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*, .pdf, .doc, .docx" />
          <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-[80%] gap-4">
            <div className="flex items-center gap-4">
              {fileName && <p className="text-gray-700 font-semibold truncate max-w-[150px]">{fileName}</p>}
              {capturedImage && <img src={capturedImage} alt="Captured" className="h-16 w-16 object-cover rounded-md border" />}
            </div>
            <button onClick={handleChooseFile} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition w-full md:w-auto">
              {fileName || capturedImage ? "CHANGE FILE" : "CHOOSE FILE"}
            </button>
            <div className="flex items-center gap-6 text-gray-600">
              <FaUpload onClick={handleChooseFile} className="text-2xl cursor-pointer hover:text-green-500" />
              <FaCamera onClick={toggleCamera} className="text-2xl cursor-pointer hover:text-green-500" />
              {(fileName || capturedImage) && <FaXmark onClick={clearSelection} className="text-2xl cursor-pointer hover:text-red-500" />}
            </div>
          </div>
          {cameraOpen && (
            <div className="mt-4 flex flex-col items-center relative w-full">
              <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="rounded-lg border-2 border-gray-300 w-full max-w-[400px]" />
              <FaCheck onClick={capturePhoto} className="mt-2 text-green-500 text-2xl cursor-pointer" title="Capture Photo" />
            </div>
          )}
        </div>
      </div>

      {/* Position Section */}
      <div className='bg-white w-full max-w-[1600px] min-h-[200px] rounded-[20px] p-6 md:p-10 shadow-lg mx-auto opacity-90'> 
        <div className='flex gap-1 mb-4'> 
          <label className='text-lg font-semibold'>What position are you applying for ?</label>
          <p className='text-red-500'>*</p>
        </div>
        <select value={position} onChange={(e) => setPosition(e.target.value)} className='border-b-2 border-gray-400 w-full focus:border-green-500 outline-none px-2 py-2 bg-white'>
          <option value="" disabled></option>
          {jobs.map((job, index) => <option key={index} value={job}>{job}</option>)}
        </select>
        {position && <p className='mt-2 text-sm text-gray-500'> Selected: {position}</p>}
      </div>

      {/* Employment Status Section */}
      <div className='bg-white w-full max-w-[1600px] min-h-[230px] rounded-[20px] p-8 shadow-lg mx-auto opacity-90'>
        <div className='flex gap-2 items-center mb-4'> 
          <label className='text-lg font-semibold'> What is your current employment status ?</label>
          <p className='text-red-500'>*</p>
        </div>
        <div className='flex flex-col space-y-3'>
          {["Employed", "Unemployed", "Self Employed", "Student"].map((status) => (
            <label key={status} className='flex items-center gap-3 cursor-pointer'>
              <input type='radio' name='employmentStatus' value={status} checked={employmentStatus === status} onChange={() => setEmploymentStatus(status)} className='h-5 w-5 accent-green-500' />
              <span className='text-gray-700'>{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Resume Method Section */}
      <div className='bg-white w-full max-w-[1600px] min-h-[200px] rounded-[20px] p-8 shadow-lg mx-auto opacity-90'> 
        <div className='flex gap-1 mb-4'> 
          <label className='text-lg font-semibold'>How do you prefer to submit your resume ?</label>
          <p className='text-red-500'>*</p>
        </div>
        <div className="space-y-2 bg-white rounded-lg w-full max-w-[400px]">
          {["Upload File", "Provide URL"].map((option, index) => (
            <label key={index} onClick={() => setUploadMethod(option)} className="flex items-center gap-4 cursor-pointer border border-gray-200 rounded-md px-4 py-3 hover:border-green-400 hover:bg-green-50 transition">
              <div className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition ${uploadMethod === option ? "bg-green-500 border-green-500" : "border-gray-400"}`}>
                <div className={`w-2.5 h-2.5 bg-white rounded-full transform transition ${uploadMethod === option ? "scale-100" : "scale-0"}`} />
              </div>
              <span className="text-gray-700 font-medium">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Conditional Resume Inputs */}
      {uploadMethod === "Upload File" && (
        <div className='bg-white w-full max-w-[1600px] min-h-[140px] rounded-[20px] px-8 py-4 shadow-lg opacity-90 mx-auto'> 
          <input type="file" ref={resumeFileInputRef} onChange={handleResumeFileChange} className="hidden" accept=".pdf,.doc,.docx" />
          <div className='w-full border-2 border-dotted border-gray-400 flex items-center justify-center bg-white p-4 cursor-pointer' onClick={handleChooseResumeFile}>
            <div className='flex items-center justify-between w-full'>
              <p className='text-lg font-medium truncate max-w-[80%]'>{resumeFileName || "Choose file"}</p>
              <FiUpload className="text-xl"/>
            </div>
          </div>
        </div>
      )}

      {uploadMethod === "Provide URL" && (
        <div className='bg-white w-full max-w-[1600px] min-h-[150px] rounded-[20px] p-8 shadow-lg mx-auto opacity-90'> 
          <div className='flex md:px-8 items-center gap-1 mb-4'>
            <p className='text-gray-700 text-lg font-semibold'>Profile Url</p>
            <p className='text-red-500'>*</p>
          </div>
          <div className='relative w-full md:mx-8'>
            <CiGlobe  className='absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-2xl' />
            <input type="url" value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)} className="border-b-2 border-gray-400 focus:border-green-500 outline-none pl-12 py-2 w-full" />
          </div>
        </div>
      )}

      {/* Terms & Conditions Section */}
      <div className='bg-white w-full max-w-[1600px] min-h-[340px] rounded-[20px] p-8 shadow-lg mx-auto opacity-90'> 
        <div className='flex gap-1 mb-4'> 
          <label className='text-lg font-semibold'>Terms and Conditions</label>
          <p className='text-red-500'>*</p>
        </div>
        <div className='w-full border border-gray-400 rounded-sm p-4 bg-gray-50 mb-4'>
          <p className="text-sm md:text-base leading-relaxed">I certify that my answers are true and honest to the best of my knowledge. If this application leads to my eventual employment, I understand that any false or misleading information in my application or interview may result in my employment being terminated.</p>
        </div>
        <div className='flex gap-3 items-center'> 
          <input type='checkbox' checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className='w-5 h-5 accent-green-500'/>
          <p> I accept the Terms and Conditions. </p>
        </div>
      </div>

      {/* Signature Section */}
      <div className="bg-white w-full max-w-[1600px] min-h-[300px] rounded-[20px] px-8 py-6 shadow-lg opacity-90 mx-auto">
        <label className="text-lg font-semibold mb-4 block">Signature</label>
        <div className="border-2 border-dashed border-gray-400 rounded-lg bg-gray-50 mb-4 overflow-hidden">
          <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ className: "w-full h-[200px]" }} />
        </div>
        <div className="flex gap-4">
          <button onClick={clearSignature} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Clear</button>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-[1600px] px-4 pb-12">
        <button 
        onClick={handleSubmit}
        className="flex-1 px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:scale-105 transition-all">Submit</button>
        <button onClick={() => setReviewMode(true)} className="flex-1 px-8 py-3 rounded-full border-2 border-green-500 text-green-600 font-semibold hover:bg-green-500 hover:text-white transition-all">Review</button>
      </div>

      {/* Review Modal */}
      {reviewMode && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-[900px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-green-700 mb-6">Review Your Application</h2>
            <div className="space-y-4 text-gray-700">
              <ReviewItem label="First Name" value={firstName} />
              <ReviewItem label="Last Name" value={lastName} />
              <ReviewItem label="Email" value={email} />
              <ReviewItem label="Phone" value={phone} />
              <ReviewItem label="Date of Birth" value={dob} />
              <ReviewItem label="Position Applied" value={position} />
              <ReviewItem label="Employment Status" value={employmentStatus} />
              <ReviewItem label="Resume Method" value={uploadMethod} />
              {uploadMethod === "Upload File" && <ReviewItem label="Resume File" value={resumeFileName} />}
              {uploadMethod === "Provide URL" && <ReviewItem label="Profile URL" value={profileUrl} />}
            </div>
            <div className="flex flex-col md:flex-row justify-end gap-4 mt-8">
              <button onClick={() => setReviewMode(false)} className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300">Edit</button>
              <button
              onClick={handleSubmit}
               className="px-6 py-2 rounded-full bg-green-600 text-white hover:bg-green-700">Confirm & Submit</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Form