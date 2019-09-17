import React, { Component } from 'react';
import CustomNavbar from './CustomNavbar.Component'
import * as RcB from 'react-bootstrap'

class Payments extends Component {

    constructor(props){
        super(props);
        this.state = {
            employerName: '',
            github_issue: '',
            issue_link: '',
            amount: '',
            secret_key: '',
            distributor_public_key: '',
            note: '',
            response: '',
            status: '',
            show: false
        }
        this.alert = React.createRef();
        this.changeEmployerName = this.changeEmployerName.bind(this)
        this.changeSecretKey = this.changeSecretKey.bind(this)
        this.changePublicKey = this.changePublicKey.bind(this)
        this.changeAmount = this.changeAmount.bind(this)
        this.changeGitIssue = this.changeGitIssue.bind(this)
        this.changeGitLink = this.changeGitLink.bind(this)
        this.changeNote = this.changeNote.bind(this)
        this.addIssue = this.addIssue.bind(this)
    }

    changeEmployerName(event){
        this.setState({
            employerName: event.target.value
        });
    }

    changeAmount(event){
        this.setState({
            amount: event.target.value
        });
    }

    changeGitIssue(event){
        this.setState({
            github_issue: event.target.value
        });
    }

    changeGitLink(event){
        this.setState({
            issue_link: event.target.value
        });   
    }

    addIssue(event){
        this.callBackendAPI()
            .then(res => {
                this.setState({status: res.status, response: res.link, show: true})
            })
            .catch(err => console.log(err));
    }

    callBackendAPI = async () => {
        const req_body = {
            sourceSecretKey: this.state.secret_key,
            destinationKey: this.state.public_key,
            amount: this.state.amount
        }
        const response = await fetch('/payment/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req_body)
        });
        const body = await response.json();
    
        if (response.status !== 200) {
          throw Error(body.message) 
        }
        return body;
    };

    render() {
        return (
            <div>
                <CustomNavbar/>
                <RcB.Container>
                    <RcB.Alert variant='success' show={this.state.show} ref={this.alert}>
                        Transaction {this.state.status} and can be viewed at 
                        <span> </span><RcB.Alert.Link href={this.state.response}>this link</RcB.Alert.Link>. 
                    </RcB.Alert>
                </RcB.Container>
                <RcB.Container style={{marginTop: 30}}>
                    <RcB.Row className="justify-content-md-center">
                    <RcB.Col xs lg="2"></RcB.Col>
                    <RcB.Col md="auto"><h1>Payment</h1></RcB.Col>
                    <RcB.Col xs lg="2"></RcB.Col>
                    </RcB.Row>
                </RcB.Container>
                <RcB.Container  style={{marginTop: 10}}>

                    <RcB.InputGroup className="mb-3">
                        <RcB.InputGroup.Prepend>
                        <RcB.InputGroup.Text id="git_issue">Issue Details</RcB.InputGroup.Text>
                        </RcB.InputGroup.Prepend>
                        <RcB.FormControl
                        placeholder="Issue Details"
                        aria-label="Issue Details"
                        aria-describedby="basic-addon1"
                        onChange={this.changeGitIssue}
                        />
                    </RcB.InputGroup>

                    <RcB.InputGroup className="mb-3">
                        <RcB.InputGroup.Prepend>
                            <RcB.InputGroup.Text id="git_link_des">
                            https://github.com/project/issues/...
                            </RcB.InputGroup.Text>
                        </RcB.InputGroup.Prepend>
                        <RcB.FormControl id="git_link" onChange={this.changeGitLink} aria-describedby="basic-addon3" />
                    </RcB.InputGroup>

                    <RcB.InputGroup className="mb-3">
                        <RcB.InputGroup.Prepend>
                        <RcB.InputGroup.Text>Amount in Lumen</RcB.InputGroup.Text>
                        </RcB.InputGroup.Prepend>
                        <RcB.FormControl onChange={this.changeAmount} aria-label="Amount (to the nearest dollar)" />
                        <RcB.InputGroup.Append>
                        <RcB.InputGroup.Text>.00</RcB.InputGroup.Text>
                        </RcB.InputGroup.Append>
                    </RcB.InputGroup>

                
                    <RcB.Form.Group style={{marginTop: 20}} as={RcB.Row}>
                        <RcB.Col sm={{ span: 4, offset: 5 }}>
                        <RcB.Button variant="dark" onClick={this.addIssue}>Submit the Issue</RcB.Button>
                        </RcB.Col>
                    </RcB.Form.Group>
       
                </RcB.Container>
            </div>
        )
    }
}

export default Payments;