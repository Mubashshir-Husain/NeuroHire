import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App.jsx';
import { FaArrowLeft } from 'react-icons/fa';


function InterviewHistory() {
    const [interviews, setInterviews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/interview/get-interview", { withCredentials: true });
                console.log(result.data);

                setInterviews(result.data);
            } catch (error) {
                console.log(error);
            }
        }

        getMyInterviews();

    }, [])

    return (
        <div className='min-h-screen bg-linear-to-br from-gray-50 to-emerald-50 py-10'>
            <div
                onClick={() => navigate("/")}
                className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto'>
                <div className='mb-10 w-full flex items-start gap-4 flex-wrap'>
                    <button className='mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition'><FaArrowLeft className='text-gray-600' /></button>

                    <div>
                        <h1 className='text-3xl font-bold flex-nowrap text-gray-800'> Interview History</h1>
                        <p className='text-gray-500 mt-2'>
                            Track your past interviews and performance reports
                        </p>
                    </div>

                </div>


                {interviews.length === 0 ?
                    <div className='p-10 bg-white rounded-2xl shadow text-center'>
                        <p className='text-gray-500'>
                            No interviews found. Start your first interview.
                        </p>

                    </div>
                    :
                    <div className='grid gap-6'>
                        {
                            interviews.map((item, index) => (
                                <div key={index} className='p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100'>
                                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                <div>
                                    <h3 className='text-lg font-semibold text-gray-800'>{item.role}</h3>
                                    <p className='mt-1 text-gray-500 text-sm'>{item.experience} <span className='font-bold'> - {item.mode}</span></p>
                                    <p className='mt-2 text-xs text-gray-400'>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className='flex items-center gap-6'>

                                </div>
                                    </div>
                                </div>
                            ))
                        }

                    </div>}


            </div>
        </div>
    )
}

export default InterviewHistory
