import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import Step3Report from '../Components/Step3Report';

function InterviewReports() {

  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await axios.get(serverUrl + `/api/interview/report/${id}`, { withCredentials: true });
        console.log(result.data);
        setReport(result.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchReport();
  }, [id])

  if (!report) {
    return <div className='flex items-center justify-center min-h-screen'>
      <p className='text-gray-500 text-lg'>Loading Report...</p>
    </div>
  }

  return <Step3Report report={report} />
}

export default InterviewReports
