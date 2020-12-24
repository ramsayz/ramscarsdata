import {Button, Card, Grid, Paper, Table, TableCell, TableHead, TableRow, TextField, Typography} from "@material-ui/core"
import { useEffect, useState } from "react";
import './App.css';
import axios from 'axios'
function App() {
  const [modelName,setModelName]=useState('')
  const [modelCost,setModelCost]=useState("")
  const [carsList,setCarsList]=useState([])

  useEffect(()=>{
axios.get("http://localhost:9002/read").then(resp=>{console.log(resp.data)
  setCarsList(resp.data)}).catch((err)=>{
    console.log(err)
  })

  },[])

  ////////////UPDATE HANDLER
  const handleUpdate=(id)=>{
    const newCost=prompt("Enter the new cost:")
    //alert(newCost.match('/^[0-9]+$/'))
        if(newCost!=null&&newCost!=''&&Number(newCost)!==0){
      
      axios.put("http://localhost:9002/update",{id:id,cost:newCost}).then(()=>{
      alert("Cost updated...")
      setCarsList(carsList.map(car=>{
        if(car._id==id){
          return {...car,cost:Number(newCost)}
        }
        return car
      }))
    })
    }
    
  }
  //////////////DELETE HANDLER
  const handleDelete=(id)=>{
    console.log(id)
    
       axios.delete(`http://localhost:9002/delete/${id}`).then(()=>{
        alert("Deleted.")
        setCarsList(carsList.filter(car=>{
          return car._id!==id
        }))
      }
      ).catch(err=>{
        console.log("Error occured while deleting "+err)
      })
    }
   
  ///////////////////////SUBMIT HANDLER
  const handleSubmit=()=>{
    console.log(modelName," ",modelCost)
      axios.post("http://localhost:9002/insert",{model:modelName,cost:modelCost}).then((resp)=>{
        console.log(resp.data)
        setCarsList([...carsList,{_id:resp.data._id,name:modelName,cost:modelCost}])
        alert('Car added. Thank you.')
        setModelCost('')
        setModelName('')
      }).catch((err)=>{alert('Not added. '+err)})
}
//////////////////////////////////////////RETURN
  return (
    <div className="App">
      <Typography style={{fontSize:"50px",backgroundColor:"pink"}}>Car cost index - de Ram's</Typography>
      {/* <Paper style={{height:'200px',margin:"5%"}}> */}
        <Grid container justify="center" spacing="1" style={{height:'200px',marginTop:"2%"}} >
          <Grid item xs="12">
            <Typography>Enter the Car details:</Typography>
          </Grid>
          <Grid item xs="12" >
            {/* <Typography>Model Name:</Typography> */}
            <TextField label="Model Name" required variant='outlined' placeholder="Enter car model" value={modelName} onChange={(e)=>{setModelName(e.target.value)}}/>
          </Grid>
          <Grid item xs="12" >
            {/* <Typography>Model Cost:</Typography> */}
          <TextField required label="Model Cost" type="number" variant='outlined' placeholder="Enter car cost" value={modelCost} onChange={(e)=>{setModelCost(e.target.value)}} />
          </Grid>
          <Grid item xs="12" >
            <Button variant='outlined' onClick={handleSubmit}>Add</Button>
          
          </Grid>
          
        </Grid>
        <hr></hr>
        <Typography style={{marginTop:'2%'}}>List of owned cars with prices..</Typography>
      <Card style={{paddingLeft:'5%',paddingRight:'5%',marginLeft:'25%',width:'50%',height:'300px',overflowY:'auto',overflowX:'auto'}}>
      {carsList.length!==0?<><Table >
  <TableHead >
    <TableCell><u><b>Car Model Name</b></u></TableCell>
    <TableCell><u><b>Cost(in Rupees)</b></u></TableCell>
    
    </TableHead>
  {carsList.map(car=>{return(
    <TableRow>
    <TableCell>{car.name}</TableCell>
    <TableCell>{(car.cost)/100000}{' Lakhs'}</TableCell>
    <TableCell><Button style={{padding:"0px",margin:"0px",backgroundColor:"yellow"}} onClick={()=>{handleUpdate(car._id)}}>Update</Button></TableCell>
    <TableCell><Button style={{padding:"0px",margin:"0px",backgroundColor:"#E74C3C ",color:'white'}} onClick={()=>{handleDelete(car._id)}}>Delete</Button></TableCell>
    
      </TableRow>
  )})}
  
  
 </Table></>:'' }</Card>
{/* <div>{carsList.map(car=><h2>{car.name}</h2>)}</div> */}

      
    </div>
  );
}

export default App;
