import React, { Component } from 'react';
import CustomNavbar from './CustomNavbar.Component';
import * as RcB from 'react-bootstrap';
import keys from '../keys'

class Employer extends Component{
    constructor(props){
        super(props)
        this.state = {
            submitting: false,
            data: '',
            employerId: '',
            employerName: 'Kaushal Mhalgi',
            issues: [],
            showModal: false,
            accountId: keys.Issuer["Public Key"],
            secretKey: keys.Issuer["Private Key"],
            issue_title: '',
            github_link: '',
            bounty: 0,
            employerPublic: keys.Issuer["Public Key"],
            employerPrivate: keys.Issuer["Private Key"],
            DistributorPublic: keys.Distributor["Public Key"],
            showToast: false,
            DistributorPrivate: keys.Distributor["Private Key"],
            toast_text: 'New Issue added, waiting for money transfer',
        }
        this.githubIssues = this.githubIssues.bind(this);
        this.getIssues = this.getIssues.bind(this);
        this.setShow = this.setShow.bind(this);
        this.handleBountyChange = this.handleBountyChange.bind(this);
        this.handleLinkChange = this.handleLinkChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.callIssueBackend = this.callIssueBackend.bind(this);
        this.addNewIssue = this.addNewIssue.bind(this);
        this.callPaymennt = this.callPaymennt.bind(this);
        this.setToastShow = this.setToastShow.bind(this);
    }

    componentDidMount(){
        this.getIssues()
            .then((res) => {
                res.forEach(element => {
                    this.setState(state => {
                        const issues = state.issues.concat(element)
                        return {
                            issues
                        }
                    })
                });
            })
    }

    handleTitleChange(event){
        this.setState({issue_title: event.target.value})
    }

    handleLinkChange(event){
        this.setState({github_link: event.target.value})
    }

    handleBountyChange(event){
        this.setState({bounty: event.target.value})
    }

    getIssues = async () => {
        const response = await fetch('http://104.40.7.102:3000/api/org.acme.tracker.Issue');
        const body = await response.json();
        if (response.status !== 200) {
          throw Error(body.message) 
        }
        return body;
    }

    callIssueBackend(){
        this.setState({submitting: true})
        this.addNewIssue().then(res => {
            console.log(res)
            this.setState({
                showToast: true,
                toast_text: "New Issue added, waiting for money transfer"
            })
            this.callPaymennt().then(res2 => {
                console.log(res2)
                this.setState({
                    showToast: true,
                    submitting: false,
                    showModal: false,
                    toast_text: "Bounty transferred to distributor"
                });
                this.setState(state => {
                    const issues = state.issues.concat(res)
                    return {
                        issues
                    }
                })
            })
        })
    }

    callPaymennt = async () => {
        const req_body = {sourceSecretKey: this.state.employerPrivate, destinationKey: this.state.DistributorPublic, amount: this.state.bounty}
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
    }

    addNewIssue = async () => {
        const req_body = {random_hash: this.state.issue_title, github_link: this.state.github_link, bounty: this.state.bounty, status: "OPEN", employer_name: this.state.employerName}
        const response = await fetch('http://104.40.7.102:3000/api/org.acme.tracker.Issue', {
            method: "post",
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
    }

    githubIssues(props) {
        const issueList = (
            <RcB.Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Issue Title</th>
                    <th>github link</th>
                    <th>Status</th>
                    <th>Bounty</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.issues.map((issue) => 
                        <tr>
                            <td>{issue.random_hash}</td>
                            <td>{issue.github_link}</td>
                            <td><RcB.Badge variant="dark">{issue.status}</RcB.Badge></td>
                            <td>{issue.bounty}</td>
                        </tr>
                    )}
                </tbody>
            </RcB.Table>
        );
        return(
            <div>
                {issueList}
            </div>
        )
    }

    setShow(show){
        this.setState({show})
    }

    setToastShow(show){
        this.setState({show})
    }

    render(){
        return(
            <div>
                <CustomNavbar name={this.state.employerName} userType="Employer" accountId={this.state.accountId}/>
                <RcB.Container style={{marginTop: 15, cursor: 'pointer'}}>
                    <RcB.Card>
                        <RcB.Card.Body>
                        <RcB.Button variant="light" onClick={this.setShow}>+ Add another issue</RcB.Button>
                        </RcB.Card.Body>
                    </RcB.Card>
                </RcB.Container>
                <RcB.Container style={{marginTop: 20}}>
                    <h4>Existing Issues</h4>
                    <this.githubIssues issues={this.state.issues}/>
                </RcB.Container>
                <RcB.Modal show={this.state.show}
                    onHide={() => this.setState({show: false})}
                    size="lg"
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <RcB.Modal.Header closeButton>
                        <RcB.Modal.Title id="example-custom-modal-styling-title">
                            Add New Issue
                        </RcB.Modal.Title>
                    </RcB.Modal.Header>
                    <RcB.Modal.Body>
                        <RcB.Container  style={{marginTop: 10}}>

                            <RcB.InputGroup className="mb-3">
                                <RcB.InputGroup.Prepend>
                                <RcB.InputGroup.Text id="git_issue">Issue Details</RcB.InputGroup.Text>
                                </RcB.InputGroup.Prepend>
                                <RcB.FormControl
                                placeholder="this should be unique"
                                aria-label="Issue Title"
                                aria-describedby="basic-addon1"
                                onChange={this.handleTitleChange}
                                />
                            </RcB.InputGroup>

                            <RcB.InputGroup className="mb-3">
                                <RcB.InputGroup.Prepend>
                                    <RcB.InputGroup.Text id="git_link_des">
                                    https://github.com/project/issues/...
                                    </RcB.InputGroup.Text>
                                </RcB.InputGroup.Prepend>
                                <RcB.FormControl id="git_link" onChange={this.handleLinkChange} aria-describedby="basic-addon3" />
                            </RcB.InputGroup>

                            <RcB.InputGroup className="mb-3">
                                <RcB.InputGroup.Prepend>
                                <RcB.InputGroup.Text>Bounty in Lumen</RcB.InputGroup.Text>
                                </RcB.InputGroup.Prepend>
                                <RcB.FormControl onChange={this.handleBountyChange} aria-label="Amount (to the nearest dollar)" />
                                <RcB.InputGroup.Append>
                                <RcB.InputGroup.Text>.00</RcB.InputGroup.Text>
                                </RcB.InputGroup.Append>
                            </RcB.InputGroup>


                            <RcB.Form.Group style={{marginTop: 20}} as={RcB.Row}>
                                <RcB.Col sm={{ span: 4, offset: 5 }}>
                                <RcB.Button variant="dark" disabled={this.state.submitting} onClick={this.callIssueBackend}>Submit the Issue</RcB.Button>
                                </RcB.Col>
                            </RcB.Form.Group>

                        </RcB.Container>
                    </RcB.Modal.Body>
                </RcB.Modal>
                <RcB.Row style={{position: "absolute", bottom: 15, right: 15}}>
                    <RcB.Col>
                        <RcB.Toast onClose={() => this.setState({showToast: false})} show={this.state.showToast} delay={3000} autohide>
                        <RcB.Toast.Header>
                            <img
                            src="holder.js/20x20?text=%20"
                            className="rounded mr-2"
                            alt=""
                            />
                            <strong className="mr-auto">Update</strong>
                            <small>11 mins ago</small>
                        </RcB.Toast.Header>
                        <RcB.Toast.Body>{this.state.toast_text}</RcB.Toast.Body>
                        </RcB.Toast>
                    </RcB.Col>
                </RcB.Row>
            </div>
        )
    }
}

export default Employer;