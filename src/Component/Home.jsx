import React from 'react'
import Form from './Form'
import { ToastContainer } from 'react-toastify'

const Home = () => {
  return (
    <>
    <ToastContainer position='top-right' autoClose={4000}/>
      <Form /> 
    </>
  )
}

export default Home
