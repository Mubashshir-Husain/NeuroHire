import React, { useState } from 'react'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("free");

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credites: 100,
      description: "Perfect for beginners starting interview preprations.",
      features: [
        "100 AI Interview credits",
        "Basic Performance Report.",
        "Voice Interview Access.",
        "Limited Interview History.",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Basic plan",
      price: "₹100",
      credites: 150,
      description: "Great for focused prectice and skill improvement.",
      features: [
        "150 AI Interview credits",
        "Detailed Performance Report.",
        "Performance Analysis.",
        "Full Interview History.",
      ],
    },
    {
      id: "Pro",
      name: "Pro Plan",
      price: "₹500",
      credites: 800,
      description: "Best Value for serious interview preprations.",
      features: [
        "800 AI Interview credits",
        "Advance AI Feedback.",
        "Skill Trend Analysis.",
        "Priority AI Processing.",
      ],
      badge: "Best Value",
    },
  ]

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-100 to-emerald-100 py-16 px-6'>

      <div className='max-w-6xl mx-auto mb-14 flex items-start gap-4'>
        <button
          onClick={() => navigate("/")}
          className='mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition cursor-pointer'>
          <FaArrowLeft className='text-gray-600' />
        </button>

        <div className='text-center w-full'>
          <h1 className='text-4xl font-bold text-gray-800'>
            Choose Your Plan
          </h1>
          <p className='mt-3 text-gray-500 text-lg'>
            Flexible pricing to match your needs and interview preperations.
          </p>
        </div>
      </div>


      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
        {
          plans.map((plan) => {
            const isSelected = selectedPlan === plan.id

            return (
              <motion.div key={plan.id}
                whileHover={!plan.default && { scale: 1.03 }}
                onClick={() => !plan.default && setSelectedPlan(plan.id)}
                className={`relative rounded-3xl p-8 transition-all duration-300 border
            ${isSelected ? "border-emerald-600 shadow-2xl bg-white" : "border-gray-200 bg-white shadow-md"
                  }
            ${plan.default ? "cursor-default" : "cursor-pointer"}
            `}
              >

                {plan.badge && (
                  <div className='absolute top-6 right-6 bg-emerald-600 text-white text-xs px-4 py-1 rounded-full shadow'>
                    {plan.badge}
                  </div>
                )}

                {plan.default && (
                  <div className='absolute top-6 right-6 bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full'>
                    Default
                  </div>
                )}

                <h3 className='text-xl font-semibold text-gray-800'>
                  {plan.name}
                </h3>

                <div className='mt-4'>
                  <span className='text-3xl font-bold text-emerald-600'>{plan.price}</span>
                  <p className='mt-1 text-gray-500'>{plan.credites} Credits</p>
                </div>

                <p className='text-gray-500 mt-4 text-sm leading-relaxed'>
                  {plan.description}
                </p>

                <ul className='mt-6 space-y-3 text-left'>
                  {plan.features.map((feature, i) => (
                    <li key={i} className='flex items-center gap-3'>
                      <FaCheckCircle className='text-emerald-500 text-sm' />
                      <span className='text-gray-700'>{feature}</span>
                    </li>
                  ))}
                </ul>

                {
                  !plan.default && (
                    <button
                      // onClick={() => navigate("/signup")}
                      className={`mt-8 w-full py-3 rounded-xl font-semibold transition 
                ${isSelected ? "bg-emerald-600 text-white hover:opacity-90" : "bg-gray-50 text-gray-700 hover:bg-emerald-100"
                        }`}>
                      {isSelected ? "Proceed to Pay" : "Select Plan"}
                    </button>
                  )
                }

              </motion.div>
            )
          })
        }
      </div>

    </div>
  )
}

export default Pricing
