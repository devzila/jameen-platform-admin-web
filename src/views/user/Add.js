import React, { useEffect } from "react";
import { useForm } from 'react-hook-form';
// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col
} from "react-bootstrap";

function Add() { 
    const {register, handleSubmit} = useForm();
  
    const onSubmit = (data) => {
       console.log(data);
    };

  return (
    <>
       <div>
      <div className="card text-bg-dark mb-3" styles="max-width: 18rem;">
  <div className="card-body">
  <form onSubmit={handleSubmit(onSubmit)}>
  <div className="mb-3">
    <label htmlFor="exampleInputName1" className="form-label"> First Name</label>
    <input type="name"  name="name" className="form-control" id="exampleInputName1" {...register('name', { required: true })} aria-describedby="emailHelp"/>
  </div>
  <div className="mb-3">
  <label htmlFor="exampleInputName1" className="form-label">Last Name</label>
    <input type="name"  name="name" className="form-control" id="exampleInputName1" {...register('name', { required: true })} aria-describedby="emailHelp"/>
  </div>
  <label htmlFor="exampleInputName1" className="form-label">User Name</label>
    <input type="name"  name="name" className="form-control" id="exampleInputName1" {...register('name', { required: true })} aria-describedby="emailHelp"/>
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">Enter Your Email</label>
    <input type="email"  name="email" className="form-control" id="exampleInputEmail1" {...register('email', { required: true })} aria-describedby="emailHelp"/>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputDetail1" className="form-label">Enter your Adress</label>
    <input type="detail"  name="detail" className="form-control" id="exampleInputdetail1" {...register('detail', { required: true })} />
  </div>
  <div className="mb-3">
    <label htmlFor="typeNumber" className="form-label">Number input</label>
    <input type="number" name="number" id="typeNumber" className="form-control" {...register('phone_number', { required: true })} />

  </div>
  
  <button type="submit" className="btn btn-primary">Submit Form</button>
</form>
  </div>
</div>
    </div>
     </>
  );
}

export default Add;
