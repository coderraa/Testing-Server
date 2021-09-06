const express = require('express')
const app = express()
const nodemailer = require("nodemailer");
const axios = require('axios');
let port = process.env.PORT || 3000


app.use(express.json());

async function lastbillpaid(a) {
  try {
    const response = await axios.get('http://qatest.800mycoke.ae:9090/askArwa/getChatResponse.jsp?customerid='+a);
    console.log(response.status);
    return "Pending Amount Status: "+response.data.last_bill_paid.msg
  } catch (error) {
    console.error(error);
    return error
  }
}

async function nextbilldue(a) {
  try {
    const response = await axios.get('http://qatest.800mycoke.ae:9090/askArwa/getChatResponse.jsp?customerid='+a);
    console.log(response.status);
    return "Next Bill Due Status: "+response.data.next_bill_due.msg
  } catch (error) {
    console.error(error);
    return error
  }
}

async function soa(a) {
  try {
    const response = await axios.get('http://qatest.800mycoke.ae:9090/askArwa/getChatResponse.jsp?customerid='+a);
    console.log(response.status);
    return "Outstanding Amount Status: "+response.data.total_outstanding.outstanding
  } catch (error) {
    console.error(error);
    return error
  }
}

async function intialcooler(a) {
  try {
    const response = await axios.get('http://qatest.800mycoke.ae:9090/askArwa/getChatResponse.jsp?customerid='+a);
    console.log(response.status);
    return response.data.asset_details
  } catch (error) {
    console.error(error);
    return error
  }
}


async function ordercancel(a) {
  try {
    const response = await axios.get('http://qatest.800mycoke.ae:9090/askArwa/getChatResponse.jsp?customerid='+a);
    console.log(response.status);
    return "Order Cancellation: "+response.data.order_details.orderCancellation
  } catch (error) {
    console.error(error);
    return error
  }
}

async function orderstatus(a) {
  try {
    const response = await axios.get('http://qatest.800mycoke.ae:9090/askArwa/getChatResponse.jsp?customerid='+a);
    console.log(response.status);
    return "Order Status: "+response.data.order_details.status
  } catch (error) {
    console.error(error);
    return error
  }
}

async function coolercomplain(a,body) {
  try {
    const response = await axios.get('http://qatest.800mycoke.ae:9090/askArwa/getChatResponse.jsp?customerid='+a);
    console.log(response.status);
    const responsemail = await axios.get('http://qatest.800mycoke.ae:9090/askArwa/sendMail.jsp?customerId='+a+'&body='+body+'&countryCode='+response.data.country);
    console.log(responsemail.status);
    return responsemail.data.msg
  } catch (error) {
    console.error(error);
    return error
  }
}

async function verify(a,id1,id2) {
  try {
    const response = await axios.get('http://qatest.800mycoke.ae:9090/askArwa/verifyEquipment.jsp?customerId='+a+'&assetId='+id1+'&assetId2='+id2+'&msg='+"not varified");
    console.log(response.status);
    return "Opps! We were not able to find your equipment. A request is send to our team, and they will be in contact with you shortly."
  } catch (error) {
    console.error(error);
    return error
  }
}


async function othercomplain(a,body) {
  try {
    const response = await axios.get('http://qatest.800mycoke.ae:9090/askArwa/getChatResponse.jsp?customerid='+a);
    console.log(response.status);
    const responsemail = await axios.get('http://qatest.800mycoke.ae:9090/askArwa/sendMail.jsp?customerId='+a+'&body='+body+'&subject=Other%20Complain&countryCode='+response.data.country);
    console.log(responsemail.status);
    return responsemail.data.msg
  } catch (error) {
    console.error(error);
    return error
  }
}

app.post('/', (req, res) => {
  console.log(req.body)//this will print request data from dialogflow bot
  if(req.body.queryResult.parameters.trigger_entity=='Last Bill'){
    lastbillpaid(req.body.queryResult.parameters['phone-number']).then(function(resp) {
    console.log(resp)//resp is reponse from get api, 
    //res.send will send this to dialogflow
    res.send({
      "fulfillmentMessages": [
        {
          "text": {
            "text": [JSON.stringify(resp)]
          }
        }
      ]
    })
  })}

  else if(req.body.queryResult.parameters.trigger_entity=='Next Bill'){
    nextbilldue(req.body.queryResult.parameters['phone-number']).then(function(resp) {
      console.log(resp)//resp is reponse from get api, 
      //res.send will send this to dialogflow
      res.send({
        "fulfillmentMessages": [
          {
            "text": {
              "text": [JSON.stringify(resp)]
            }
          }
        ]
      })
    })}
  
  else if(req.body.queryResult.parameters.trigger_entity=='Order Status'){
    orderstatus(req.body.queryResult.parameters['phone-number']).then(function(resp) {
      console.log(resp)//resp is reponse from get api, 
      //res.send will send this to dialogflow
      res.send({
        "fulfillmentMessages": [
          {
            "text": {
              "text": [JSON.stringify(resp)]
            }
          }
        ]
      })
    })}
  
    else if(req.body.queryResult.parameters.trigger_entity=='Cooler Complaints'){
      intialcooler(req.body.queryResult.parameters['phone-number']).then(function(resp) {
        console.log(resp)//resp is reponse from get api, 
        //res.send will send this to dialogflow
        res.send({
          "fulfillmentMessages": [
            {
              "text": {
                "text": [JSON.stringify(resp)]
              }
            }
          ]
        })
      })}
    
      else if(req.body.queryResult.intent.displayName=='Error detect'){
        verify(req.body.queryResult.parameters['mobile_number','equipment_id','equipment_id']).then(function(resp) {
          console.log(resp)//resp is reponse from get api, 
          //res.send will send this to dialogflow
          res.send({
            "fulfillmentMessages": [
              {
                "text": {
                  "text": [JSON.stringify(resp)]
                }
              }
            ]
          })
        })}
      
  
      else if(req.body.queryResult.intent.displayName=='Verify Equipment'){
        intialcooler(req.body.queryResult.parameters['Mobile_number']).then(function(resp) {
          console.log(resp)//resp is reponse from get api, 
          //res.send will send this to dialogflow
          res.send({
            "fulfillmentMessages": [
              {
                "text": {
                  "text": [JSON.stringify(resp)]
                }
              }
            ]
          })
        })}
    

        
        else if(req.body.queryResult.intent.displayName=='Mobile_number'){
          intialcooler(req.body.queryResult.parameters['phone-number']).then(function(resp) {
            console.log(resp)//resp is reponse from get api, 
            //res.send will send this to dialogflow
            res.send({
              "fulfillmentMessages": [
                {
                  "text": {
                    "text": [JSON.stringify(resp)]
                  }
                }
              ]
            })
          })}
  
  
  
  
  
      else if(req.body.queryResult.parameters.trigger_entity=='Order Cancellation'){
    ordercancel(req.body.queryResult.parameters['phone-number']).then(function(resp) {
      console.log(resp)//resp is reponse from get api, 
      //res.send will send this to dialogflow
      res.send({
        "fulfillmentMessages": [
          {
            "text": {
              "text": [JSON.stringify(resp)]
            }
          }
        ]
      })
    })}
  
  else if(req.body.queryResult.intent.displayName=='Others Cooler mail trigger'){
      othercomplain(req.body.queryResult.parameters['phone-number'],req.body.queryResult.queryText).then(function(resp) {
        console.log(resp)//resp is reponse from get api, 
        //res.send will send this to dialogflow
        res.send({
          "fulfillmentMessages": [
            {
              "text": {
                "text": [JSON.stringify(resp)+" Your Cooler Complain query: --"+req.body.queryResult.queryResult.queryText+"-- has been registered. We will Contact you soon."]
              }
            }
          ]
        })
      })}

      else if(req.body.queryResult.intent.displayName=='Door_Problem'){
        coolercomplain(req.body.queryResult.parameters['mobile_number'],req.body.queryResult.queryText).then(function(resp) {
          console.log(resp)//resp is reponse from get api, 
          //res.send will send this to dialogflow
          res.send({
            "fulfillmentMessages": [
              {
                "text": {
                  "text": [JSON.stringify(resp)+" Your Cooler Complain query: --"+req.body.queryResult.queryText+"-- has been registered. We will Contact you soon."]
                }
              }
            ]
          })
        })}
        else if(req.body.queryResult.intent.displayName=='Light Not Working'){
          coolercomplain(req.body.queryResult.parameters['phone-number'],req.body.queryResult.queryText).then(function(resp) {
            console.log(resp)//resp is reponse from get api, 
            //res.send will send this to dialogflow
            res.send({
              "fulfillmentMessages": [
                {
                  "text": {
                    "text": [JSON.stringify(resp)+" Your Cooler Complain query: --"+req.body.queryResult.queryText+"-- has been registered. We will Contact you soon."]
                  }
                }
              ]
            })
          })}

          else if(req.body.queryResult.intent.displayName=='Water Leakage'){
            coolercomplain(req.body.queryResult.parameters['phone-number'],req.body.queryResult.queryText).then(function(resp) {
              console.log(resp)//resp is reponse from get api, 
              //res.send will send this to dialogflow
              res.send({
                "fulfillmentMessages": [
                  {
                    "text": {
                      "text": [JSON.stringify(resp)+" Your Cooler Complain query: --"+req.body.queryResult.queryText+"-- has been registered. We will Contact you soon."]
                    }
                  }
                ]
              })
            })}

            else if(req.body.queryResult.intent.displayName=='Cooling Issue'){
              coolercomplain(req.body.queryResult.parameters['phone-number'],req.body.queryResult.queryText).then(function(resp) {
                console.log(resp)//resp is reponse from get api, 
                //res.send will send this to dialogflow
                res.send({
                  "fulfillmentMessages": [
                    {
                      "text": {
                        "text": [JSON.stringify(resp)+" Your Cooler Complain query: --"+req.body.queryResult.queryText+"-- has been registered. We will Contact you soon."]
                      }
                    }
                  ]
                })
              })}
  
  else if(req.body.queryResult.intent.displayName=='Others mail trigger'){
      othercomplain(req.body.queryResult.parameters['phone-number'],req.body.queryResult.queryText).then(function(resp) {
        console.log(resp)//resp is reponse from get api, 
        //res.send will send this to dialogflow
        res.send({
          "fulfillmentMessages": [
            {
              "text": {
                "text": [JSON.stringify(resp)+" Your Other Complain query: --"+req.body.queryResult.queryText+"-- has been registered. We will Contact you soon."]
              }
            }
          ]
        })
      })}


      else if(req.body.queryResult.intent.displayName=='error_verify'){
        verify(req.body.queryResult.parameters['mobile_number','equipment_id','equipment_id']).then(function(resp) {
          console.log(resp)//resp is reponse from get api, 
          //res.send will send this to dialogflow
          res.send({
            "fulfillmentMessages": [
              {
                "text": {
                  "text": [JSON.stringify(resp)]
                }
              }
            ]
          })
        })}
  
  
    else if(req.body.queryResult.parameters.trigger_entity=='SOA'){
      soa(req.body.queryResult.parameters['phone-number']).then(function(resp) {
        console.log(resp)//resp is reponse from get api, 
        //res.send will send this to dialogflow
        res.send({
          "fulfillmentMessages": [
            {
              "text": {
                "text": [JSON.stringify(resp)]
              }
            }
          ]
        })
      })}
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
