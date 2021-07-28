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

async function ordercancel(a) {
  try {
    const response = await axios.get('http://qatest.800mycoke.ae:9090/askArwa/getChatResponse.jsp?customerid='+a);
    console.log(response.status);
    if (response.data.order_details.orderCancellation != "NA") {
    return "Yes"+ " "+"No" //;
  } else {
    return "Order Cancellation: "+response.data.order_details.orderCancellation //;
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
    const responsemail = await axios.get('http://qatest.800mycoke.ae:9090/askArwa/sendMail.jsp?customerId='+a+'&body='+body+'&subject=Cooler%20Complain&countryCode='+response.data.country);
    console.log(responsemail.status);
    return responsemail.data.msg
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
  if(req.body.queryResult.parameters.Trigger_entity=='Last Bill'){
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

  else if(req.body.queryResult.parameters.Trigger_entity=='Next Bill'){
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
  
  else if(req.body.queryResult.parameters.Trigger_entity=='Order Status'){
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
  
  else if(req.body.queryResult.parameters.Trigger_entity=='Order Cancellation'){
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

      else if(req.body.queryResult.intent.displayName=='Door Problem'){
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
  
  
    else if(req.body.queryResult.parameters.Trigger_entity=='SOA'){
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
