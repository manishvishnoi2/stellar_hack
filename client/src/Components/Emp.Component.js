import React, { Component } from 'react';
import CustomNavbar from './CustomNavbar.Component';
import * as RcB from 'react-bootstrap';
import keys from '../keys'

class Employer extends Component{
    constructor(props){
        super(props)
        this.state = {
            data: '',
            employerId: '',
            employerName: 'Kaushal Mhalgi',
            issues: [
                { id: 1, title: 'Sample Issue 1', details: 'This is sample issue 1'},
                { id: 2, title: 'Sample Issue 2', details: 'This is sample issue 2'}
            ],
            accountId: keys.Issuer["Public Key"],
            secretKey: keys.Issuer["Private Key"]
        }
        this.githubIssues = this.githubIssues.bind(this);
    }

    githubIssues(props) {
        const issueList = (
            <RcB.ListGroup>
                {props.issues.map((issue) => 
                    <RcB.ListGroupItem action key={issue.id}>
                        <h5><b>{issue.title}</b></h5>
                        <p>{issue.details}</p>
                        <div></div>
                    </RcB.ListGroupItem>
                    )
                }
            </RcB.ListGroup>
        );
        return(
            <div>
                {issueList}
            </div>
        )
    }

    render(){
        return(
            <div>
                <CustomNavbar name={this.state.employerName} userType="Employer" accountId={this.state.accountId}/>
                <RcB.Container style={{marginTop: 15, cursor: 'pointer'}}>
                    <RcB.Card>
                        <RcB.Card.Body>
                            <RcB.Card.Link href="/newIssue" body>+ Add another Github Issue</RcB.Card.Link>
                        </RcB.Card.Body>
                    </RcB.Card>
                </RcB.Container>
                <RcB.Container style={{marginTop: 20}}>
                    <h4>Existing Issues</h4>
                    <this.githubIssues issues={this.state.issues}/>
                </RcB.Container>
            </div>
        )
    }
}

export default Employer;