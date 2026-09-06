import React from 'react'
import CarForm from '../components/CarForm'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Footer from '../components/Footer'


const SubmitCar = () => {
  return (
    <>
  <title>Submit Car</title>


{/* NAVBAR */}
  <Navbar/>

{/* HEADER */}
 <Header/>

  {/* FORM */}
  <CarForm/>

  {/* FOOTER */}
  <Footer/>

</>

  )
}

export default SubmitCar