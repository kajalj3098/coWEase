import './App.css';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import moment from 'moment';
import { NewLoader } from './components/loader';


const codes = [110003, 110024, 110032, 110017, 110009]

function App() {
  const [state, setState] = useState([])
  const [pincode, setPincode] = useState(110003)
  const [age, setAge] = useState(18)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    handleFunc()
  }, [])
  const startAuto = () => {
    setInterval(
      () => { handleFunc() },
      1000);
  }
  const refreshPage = () => {
    handleFunc(age)

  }
  const handleCalc = (data, age) => {
    let allData = [];
    if (data.length > 0) {
      for (let i of data) {
        if (i.sessions && i.sessions.length > 0) {
          for (let item of i.sessions) {
            item.name = i.name;
            item.district_name = i.district_name;
            item.address = i.address
            item.pincode = i.pincode
            allData.push(item)
          }
        }
      }
    }
    if (age)
      allData = allData.filter(i => i.min_age_limit == age)
    setState(allData)
  }

  const handleFunc = (age) => {
    const date = Date.now()
    let dataa = []
    for (let i of codes) {
      setLoading(true)
      Axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${i}&date=${formatDateToDDMMYYYY(date)}`)
        .then(res => res.data)
        .then(resData => {
          setLoading(false)
          for (let item of resData.centers) {
            dataa.push({ ...item })
          }
          if (dataa && age)
            handleCalc(dataa, age)
          else
            handleCalc(dataa, 18)
          console.log(dataa)
        }).catch(err => {
          setLoading(false)
        })
    }

  }
  const handleSelect = (e) => {
    setAge(e.target.value)
    handleFunc(e.target.value)
  }
  return (
    <div className="App">
      {loading && <NewLoader />}
      <div class="header">
        <a href="#default" class="logo">CoWEase</a>
        <div class="header-right">
          {/* <a class="active" href="#home">Home</a>
          <a href="#contact">Contact</a>
          <a href="#about">About</a> */}
        </div>
      </div>
      <div className="justify-content-center">
        <div className="layout-row align-items-center justify-content-center my-20 navigation">
          <button data-testid="most-upvoted-link" className="small" onClick={startAuto}>start automatic</button>
          <input type="number" name="pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
          <select name="cars" id="cars" value={age} onChange={handleSelect} >
            <option value={18} >18</option>
            <option value={45}>45</option>
          </select>
          {/* <button data-testid="most-recent-link" className="small" onClick={refreshPage}>Search</button> */}
          <button data-testid="most-upvoted-link" className="small" onClick={refreshPage}>refresh Page</button>
        </div>
        <div className="card mx-auto" style={{ width: '90%' }}>
          <table>
            <thead>
              <tr>
                <th>vaccine</th>
                <th>available_capacity</th>
                <th>age</th>
                <th>Date</th>
                <th>name</th>
                <th>district_name</th>
                <th>address</th>
                <th>pincode</th>
              </tr>
            </thead>
            <tbody>
              {state.map((item, pos) =>
                <tr data-testid="article" key="article-index" key={pos}>
                  <td data-testid="article-date">{item.vaccine}</td>
                  <td data-testid="article-title">{item.available_capacity}</td>
                  <td data-testid="article-upvotes">{item.min_age_limit}</td>
                  <td data-testid="article-date">{item.date}</td>
                  <td data-testid="article-date">{item.name}</td>
                  <td data-testid="article-date">{item.district_name}</td>
                  <td data-testid="article-date">{item.address}</td>
                  <td data-testid="article-date">{item.pincode}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* <Articles article={state} /> */}
      </div>
    </div>
  );

}

const formatDateToDDMMYYYY = (date) => {
  if (date) {
    return moment(date).format('DD-MM-YYYY');
  }
}

export default App;

