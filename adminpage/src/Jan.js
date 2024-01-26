import React from 'react'
import "./Jan.css";
import { useState,useEffect,useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import {DateRangePicker} from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { NavLink } from 'react-router-dom';


const Jan = () => {
    const [data,setData] = useState([]);
    const [allData,setAllData]=useState([]);
    const [filterdata, setFilterdata]= useState([]);  
    const [startDate,setStartDate] =useState(new Date());
    const [endDate,setEndDate] =useState(new Date());
   
    const conponentPDF= useRef();   

    useEffect(()=>{
        fetchData();
    },[])
    
    const fetchData = async()=>{
        try{
            const result = await axios("http://localhost:8082/users");
            setData(result.data);
            setAllData(result.data);
            setFilterdata(result.data);
            // console.log(result.data);
            // console.log(result.data[0].holidaydate);
        } catch (err) {
            console.log("something Wrong");
        }
        
    }

    let name,values;

    const handleInputs = (e) => {
        // console.log(e);
        name = e.target.name;
        values = e.target.value;
        setData({...data,[name]:values});
    }   

    

    const handlesearch =(e)=>{
        setFilterdata(data.filter(item =>item.employeename.toLowerCase().includes(e.target.value)))
    }

    const generatePDF= useReactToPrint({
        content: ()=>conponentPDF.current,
        documentTitle:"EmployeeData",
        // onAfterPrint:()=>alert("Data saved in PDF")
    });

    const handleSelect = (date) => {
        let filtered= allData.filter((product)=>{
            let productDate =new Date(product["holidaydate"]);
            return(
                productDate >= date.selection.startDate && productDate <= date.selection.endDate
            );
        });
        setStartDate(date.selection.startDate)
        setEndDate(date.selection.endDate);
        setData(filtered);
        // console.log(date);
        // console.log(filtered);
    };

    const selectionRange ={
        startDate: startDate,
        endDate:endDate,
        key:"selection",
    }
  
  return (
    <div className='adminpage1' ref={conponentPDF} style={{width:'100%'}}>
         <h1>Admin Page</h1>
        <hr/>  
        
        <div className='sort1'>

        <div className="search1"> 
            <NavLink to="/"><button className='button1'>Back</button></NavLink>               
                <input  type="text" name='name'  onChange={handlesearch} placeholder='Search...' />
                <button  className="btn1" onClick={generatePDF}>PDF</button>       
        </div>
        <div className='date1'>
            <DateRangePicker ranges={[selectionRange]} onChange={handleSelect}/><button className='date-button1' type='reset' onClick={handlesearch}>submit</button>
            </div>
      </div>
        <div className="adminpage-content1" >
            <table className='adminpage-table1'>
                <thead >
                    <tr>
			        <th className='heading1' name="employeename">EMPLOYEE NAME </th>
			        <th className='heading1' name="projectname">PROJECT NAME </th>
			        <th className='heading1' name="shifttimings">SHIFT TIMINGS </th>
			        <th className='heading1' name="holidaydate">HOLIDAY DATE </th>
			        <th className='heading1' name="description">DESCRIPTION </th>
			        <th className='heading1' name="managername">MANAGER NAME </th>
                    <th className='heading1' name="workingdays">WORKING DAYS </th>
                    <th className='heading1' name="status">STATUS </th>
                    </tr>
                </thead >
                <tbody>
                    {filterdata.map((user,id) => {
                        // const{employeename,projectname,shifttimings,description,managername,status} =user;
                        let date= new Date(user['holidaydate']);
                        return (
                            <tr key={id}>
                                {/* <td>{i+1} </td> */}
                                <td className='data1' name="employeename" value={data.employeename} onChange={handleInputs}>{user.employeename}</td>
                                <td className='data1' name="projectname" value={data.projectname} onChange={handleInputs}>{user.projectname}</td>
                                <td className='data1' name="shifttimings" value={data.shifttimings} onChange={handleInputs}>{user.shifttimings}</td>
                                <td className='data1' name="holidaydate" value={data.holidaydate} onChange={handleInputs}>{date.toLocaleDateString()}{/* {user.holidaydate} */}</td>
                                <td className='data1' name="description" value={data.description} onChange={handleInputs}>{user.description}</td>
                                <td className='data1' name="managername" value={data.managername} onChange={handleInputs}>{user.managername}</td>
                                <td className='data1'  >1</td>
                                <td className='data1' name="status"   ><NavLink to={`/update/${user.id}`}>
                                    <select  className='data2' name="status" value={user.status} onChange={handleInputs} /* onClick={handleStatus} */>
                                    <option value="Pending">Pending</option>
                                    <option value="Aprooved">Aprooved</option>
                                </select></NavLink></td>
                            </tr>
                        )
                    })
                }
                </tbody>
           </table>
        </div>
    </div>
)
}

export default Jan;