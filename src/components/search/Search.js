import React, {useState} from 'react'
import Form from './Form';
import ResultTable from './resulttable/ResultTable'
import {queryData} from "../../helper/PostData"

const Search = () => {
    const [fail, setFail] = useState(false)
    const [list, setList] = useState([{
        id : 1,
    }])
    const [info, setInfo] = useState({
        id : "",
        status: "",
        buyer: "",
        sku:"",
        supplier:"",
        explanation: "",
        receipt:"",
        tracking_code:""
      })

      const handleSubmit = (e) => {
        e.preventDefault();
        //console.log("HandleSubmit Button");
        //console.log(info)
        let queryString = "/?"
        /*
        TODO
        Search DATA 
        */
       Object.keys(info).forEach(key => {
           if(info[key]){
               console.log(key, info[key]);
               queryString = `${queryString}${key}=${info[key]}&`  
           }
           
        });
        if(queryString === "/?"){
            setFail(true)
        }else{
            setFail(false)
            queryString = queryString.slice(0,-1)
            console.log(queryString)
            let path = `http://144.202.67.136:8080/etsy/mapping${queryString}`
            queryData(path).then((response)=> {
                console.log(response.data)
                setList(response.data)
            }).catch((error)=> {
                console.log(error)
            })
        }
      };

      const clearBtn = () => {
          //console.log("ClearBTN")
          setInfo({
            id : "",
            status: "",
            buyer: "",
            sku:"",
            supplier:"",
            explanation: "",
            receipt:"",
            tracking_code:""
          })
      }

      const handleChange = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value });
      };

    return (
        <div>
            <Form 
            handleChange={handleChange}
            handleSubmit={handleSubmit} 
            info={info}
            fail={fail}
            clearBtn={clearBtn}
            />
            <ResultTable list={list}/>
        </div>
    )
}

export default Search
 