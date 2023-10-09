import React, { useState, useEffect } from "react";
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
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);
 
  const {register, handleSubmit, errors} = useForm();
    console.log(errors)
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
    <label htmlFor="exampleInputName1" className="form-label">Enter Company Name</label>
    <input type="name"  name="name" className="form-control" id="exampleInputName1" {...register('name', { required: true })} />
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputIdentifier1" className="form-label">Enter Company Identifier</label>
    <input type="text"  name="identifier" className="form-control" id="exampleInputIdentifier1" {...register('identifier', { required: true })} />
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputDetail1" className="form-label">Enter Company Details</label>
    <input type="text"  name="detail" className="form-control" id="exampleInputdetail1" {...register('detail', { required: true })} />
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
