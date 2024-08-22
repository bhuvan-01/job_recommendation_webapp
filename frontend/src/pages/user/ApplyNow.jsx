import React, { useState } from 'react';

const ApplyNowPage = () => {
    const [resume, setResume] = useState(null);
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [experience, setExperience] = useState('');
    const [visaStatus, setVisaStatus] = useState('');

    const handleResumeUpload = (e) => {
        setResume(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ resume, email, phoneNumber, experience, visaStatus });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Apply Now</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Resume:</label>
                    <input type="file" onChange={handleResumeUpload} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input 
                        type="tel" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>How many years of work experience do you have?</label>
                    <input 
                        type="number" 
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Will you now or in the future require sponsorship for employment visa status?</label>
                    <select 
                        value={visaStatus}
                        onChange={(e) => setVisaStatus(e.target.value)} 
                        required
                    >
                        <option value="">Select an option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
                <button type="submit" style={{ marginTop: '20px', padding: '10px 20px' }}>Submit Application</button>
            </form>
        </div>
    );
};

export default ApplyNowPage;
