import React, { Component } from 'react';
import CustomNavbar from './CustomNavbar.Component';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
import * as RcB from 'react-bootstrap';

class Balance extends Component {
    constructor(props){
        super(props);
        this.state = {
          data: null,
          balance: 0,
          accountId: '',
        };
        this.checkBalanceCall = this.checkBalanceCall.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBalanceCheck = this.handleBalanceCheck.bind(this);
    }

    handleBalanceCheck(event){
        this.checkBalanceCall()
        .then(res => this.setState({balance: res.balance}))
        .catch(err => console.log(err));
    }

    checkBalanceCall = async () => {
        const accountId = encodeURIComponent(this.state.accountId);
        const response = await fetch('/balance/'+accountId);
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };

    handleChange(event){
        this.setState({accountId: event.target.value})
    }


    render() {
        return (
            <div>
                <CustomNavbar/>
                <RcB.Container className="Balance">
                <RcB.Form style={{marginTop: 15}}>
                    <RcB.Form.Group controlId="formBasicEmail">
                        <RcB.Form.Label>accountID</RcB.Form.Label>
                        <RcB.Form.Control type="text" placeholder="Enter account Id" value={this.state.accountId} onChange={this.handleChange}/>
                        <RcB.Form.Text className="text-muted">
                        Don't enter your secret key
                        </RcB.Form.Text>
                    </RcB.Form.Group>

                    {/* <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group> */}
                    <RcB.Button variant="primary" onClick={this.handleBalanceCheck}>
                        Check Balance
                    </RcB.Button>
                    <p className="Balance_Show">
                        Balance for given accountID is {this.state.balance}
                    </p>
                </RcB.Form>
            </RcB.Container>
            </div>
            // <div className="Balance">
            //     <CustomNavbar/>
            //     <div className="Balance-Checker">
            //         <label>
            //             Account:
            //             <input type="text" name="accountID" value={this.state.accountId} onChange={this.handleChange}/>
            //         </label>
            //         <button onClick={this.handleBalanceCheck}>Check balance</button>
            //     </div>
            //     <p className="Balance_Show">
            //     Balance for given accountID is {this.state.balance}
            //     </p>
            // </div>
        )
    }
}

export default Balance;