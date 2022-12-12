import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

function App() {
 const baseUrl='https://localhost:44306/api/customer';
  //const baseUrl='https://localhost:44306/swagger/index.html';
  const [data, setData] = useState([])
  const [modalEdit, setModalEdit] = useState(false)
  const [modalInsert, setModalInsert] = useState(false)
  const [modalDelete, setModalDelete] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState({
        idCustomer: '',
        customerName: '',
        companyName: '',
        phoneNumber: ''
  })

  //guardamo lo que el usuario escribe en los inputs
  const handleChange=e=> {
    const {name, value}=e.target;
    setSelectedCustomer({
      ...selectedCustomer,
      [name]: value
    });
      console.log(selectedCustomer)
  }

  const openColseModalInsert = () => {
    setModalInsert(!modalInsert)
  }

  const openColseModalEdit = () => {
    setModalEdit(!modalEdit)
  }
  
  const openColseModalDelete = () => {
    setModalDelete(!modalDelete)
  }
  
  const requestGet = async () => {
    await axios.get(baseUrl)
    .then(response => {
      setData(response.data)
    }).catch(error => {
      console.log(error)
    })
  }

  const requestPost = async () => {
    delete selectedCustomer.idCustomer
    selectedCustomer.phoneNumber = parseInt(selectedCustomer.phoneNumber)
    await axios.post(baseUrl, selectedCustomer)
    .then(response => {
      setData(data.concat(response.data))
      openColseModalInsert()
    }).catch(error => {
      console.log(error)
    })
  } 
  
  const requestPut = async()=>{
   selectedCustomer.phoneNumber=parseInt(selectedCustomer.phoneNumber)
    await axios.put(baseUrl+"/"+selectedCustomer.idCustomer, selectedCustomer)
    .then(response=>{
      var respuesta=response.data
      var dataAuxiliar=data
      dataAuxiliar.map(customer=>{
        if(customer.idCustomer===selectedCustomer.idCustomer){
          customer.customerName=respuesta.customerName;
          customer.companyName=respuesta.companyName;
          customer.phoneNumber=respuesta.phoneNumber;
        }
      });
      openColseModalEdit()
    }).catch(error=>{
      console.log(error)
    })
  } 

  const requestDelete = async() => {
    await axios.delete(baseUrl+"/"+selectedCustomer.idCustomer)
    .then(response => {
      setData(data.filter(customer => customer.idCustomer!==response.data))
      openColseModalDelete()
    }).catch(error => {
      console.log(error)
    })
  }

  const selectModal=(customer, action)=>{
    setSelectedCustomer(customer)
    (action==='Edit')?
    openColseModalEdit(): openColseModalDelete()
  }

  useEffect(()=>{
    requestGet()
  },[])

  return (
    <div className='App'>
      <br/><br/>
      <button onClick={()=>openColseModalInsert()} className="btn btn-success"> Insert new customer </button>
      <br/><br/>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Id Customer</th>
            <th>Customer Name</th>
            <th>Company Name</th>
            <th>Phone Number</th>
            <th>Acctions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(customer=>(
            <tr key={customer.idCustomer}>
              <td>{customer.idCustomer}</td>
              <td>{customer.customerName}</td>
              <td>{customer.companyName}</td>
              <td>{customer.phoneNumber}</td>
              <td>
                <button onClick={()=>selectModal(customer, 'Edit')} className='btn btn-outline-primary'>Edit</button> {" "}
                <button onClick={()=>selectModal(customer, 'Delete')} className='btn btn-outline-danger'>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>


      <Modal isOpen = {modalInsert}>
            <ModalHeader>Insertar Cliente a Base de Datos</ModalHeader>
            <ModalBody>
                <div className='form-group'>
                  <label>Name: </label>
                  <br/>
                  <input type='text' className='form-control' name='customerName' onChange={handleChange}/>
                  <br/>
                  <label>Company: </label>
                  <br/>
                  <input type='text' className='form-control' name='companyName' onChange={handleChange}/>
                  <br/>
                  <label>Phone Number: </label>
                  <br/>
                  <input type='text' className='form-control' name='phoneNumber' onChange={handleChange}/>
                  <br/>
                </div>
            </ModalBody>
            <ModalFooter>
            <button className='btn btn-primary' onClick={()=> requestPost()}>Insert</button> {" "}
            <button className='btn btn-danger' onClick={()=> openColseModalInsert()}>Cancel</button>
            </ModalFooter>
      </Modal>

      <Modal isOpen = {modalEdit}>
            <ModalHeader>Editar Cliente de Base de Datos</ModalHeader>
            <ModalBody>
                <div className='form-group'>
                  <label>Id:</label>
                  <br/>
                  <input type='text' className='form-control' readOnly value ={selectedCustomer && selectedCustomer.idCustomer}/>
                  <br/>
                  <label>Name:</label>
                  <br/>
                  <input type='text' className='form-control' name='customerName' onChange={handleChange} value = {selectedCustomer && selectedCustomer.customerName}/>
                  <br/>
                  <label>Company:</label>
                  <br/>
                  <input type='text' className='form-control' name='companyName' onChange={handleChange} value = {selectedCustomer && selectedCustomer.companyName}/>
                  <br/>
                  <label>Phone:</label>
                  <br/>
                  <input type='text' className='form-control' name='phoneNumber' onChange={handleChange} value = {selectedCustomer && selectedCustomer.phoneNumber}/>
                  <br/>
                </div>
            </ModalBody>
            <ModalFooter>
            <button className='btn btn-primary' onClick={() => requestPut()}>Editar</button> {' '}
            <button className='btn btn-danger' onClick={() => openColseModalEdit()}>Cancelar</button>
            </ModalFooter>
      </Modal>

      <Modal isOpen = {modalDelete}>
            <ModalBody>
              ¿Seguro que desea eliminar el registro {selectedCustomer && selectedCustomer.customerName}?
            </ModalBody>
            <ModalFooter>
            <button className='btn btn-danger' onClick={() => requestDelete()}>Si</button>
            <button className='btn btn-secondary' onClick={() => openColseModalDelete()}>No</button>
            </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
