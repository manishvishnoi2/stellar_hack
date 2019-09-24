import React, { Component } from 'react';
import CustomNavbar from './CustomNavbar.Component'
import * as RcB from 'react-bootstrap';

class Dev extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "balance": 0,
            "bb": [],
            "show": false,
            "commits": [],
            dev_name: 'Kaushal Mhalgi',
            accountId: 'GBZ7Q6N4DJ6HN5LRNC7CJJAUS4B4IKMFJXVVRXHN6VDDSKGD2DAKMT77'
        }
        this.checkBalanceCall = this.checkBalanceCall.bind(this);
        this.getIssues = this.getIssues.bind(this)
        this.SubmitCommit = this.SubmitCommit.bind(this)
        this.commitSub = this.commitSub.bind(this)

    }

    componentDidMount() {
        this.checkBalanceCall()
            .then((result) => {
                this.setState({ "balance": result.balance })
            })
        this.getIssues()
    }

    checkBalanceCall = async () => {
        const accountId = 'GBZ7Q6N4DJ6HN5LRNC7CJJAUS4B4IKMFJXVVRXHN6VDDSKGD2DAKMT77';
        const response = await fetch('/balance/' + accountId);
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };

    getIssues = async () => {
        var value = 0;
        const response = await fetch('http://104.40.7.102:3000/api/org.acme.tracker.Issue')
            .then(function (u) {
                return u.json();
            })
            .then(function hl(json) {
                return json
            })

        this.setState({ "bb": response })
    }

    SubmitCommit(data) {
        console.log(data)
        this.setState({
            currentUser: {
                "bounty": data.bounty,
                "random_hash": data.random_hash,
                "github_link": data.github_link,
                "status": data.status,
                "employer_name": data.employer_name
            }
        });
        this.setState({ "show": true })

    }

    closeModal(state) {
        if (state == true) {
            this.setState({ "show": false })
        }
    }

    commitSub(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        this.setState({ "commits": [] })
        const res = fetch(this.state.currentUser["github_link"].replace('https://github.com/', 'https://api.github.com/repos/') + '/events')
            .then(function (u) {
                return u.json();
            })
            .then(json => {
                console.log(json)
                json.forEach(element => {
                    if (element["commit_id"] != null) {
                        this.setState((state) => {
                            const commits = state.commits.concat(element["commit_id"])
                            return {
                                commits
                            }
                        })
                    }
                });
            })
            .then(() => {
                this.state.commits.forEach(element => {
                    if (element == data.get('commit')) {
                        const req_body = { sourceSecretKey: 'SDNA3MJKFYXL5ZZPGRWYLKUE2V655SG6FRP4TTLKPPACA7DJMKOG7NIQ', destinationKey: 'GBZ7Q6N4DJ6HN5LRNC7CJJAUS4B4IKMFJXVVRXHN6VDDSKGD2DAKMT77', amount: this.state.currentUser["bounty"] }
                        const response = fetch('/payment/', {
                            method: 'post',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(req_body)
                        });
                    }
                })
            })
            .then(() => {
                const res = fetch('http://104.40.7.102:3000/api/org.acme.tracker.Issue/' + this.state.currentUser["random_hash"], {
                    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        "$class": "org.acme.tracker.Issue",
                        "random_hash": this.state.currentUser["random_hash"],
                        "github_link": this.state.currentUser["github_link"],
                        "bounty": this.state.currentUser["bounty"],
                        "status": "CLOSED",
                        "employer_name": this.state.currentUser["employer_name"]
                    })
                })
                    .then(function (response) {
                        console.log(response.json()) ;
                    })
            })
    }

    callPaymennt = async () => {
        const req_body = { sourceSecretKey: this.state.employerPrivate, destinationKey: this.state.DistributorPublic, amount: this.state.bounty }
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

    render() {
        return (<div><CustomNavbar name={this.state.dev_name} userType="Developer" accountId={this.state.accountId}/>
            <RcB.Container style={{marginTop: 25}}>
            <RcB.Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Github Link</th>
                        <th>Bounty</th>
                        <th>Status</th>
                        <th>Employer Name</th>
                        <th>Code Submission</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.bb.map((user) => {
                        return <tr key={user.github_link}>
                            <td>{user.github_link}</td>
                            <td>{user.bounty}</td>
                            <td>{user.status}</td>
                            <td>{user.employer_name}</td>
                            <td><RcB.Button disabled={user.status=='CLOSED'?true:false} variant="outline-dark" onClick={() => { this.SubmitCommit.call(this, user) }}>Submit</RcB.Button></td>
                        </tr>
                    })}
                </tbody>
            </RcB.Table>

            <RcB.Modal show={this.state.show}>
                <RcB.Modal.Header>
                    <RcB.Modal.Title>Modal heading</RcB.Modal.Title>
                </RcB.Modal.Header>
                <form onSubmit={this.commitSub}><RcB.Modal.Body>
                    <RcB.Form.Group>
                        <RcB.Form.Label>Commit hash</RcB.Form.Label>
                        <RcB.Form.Control id="commit" name="commit" type="text" placeholder="Enter Commit" />
                        <RcB.Form.Text className="text-muted">
                            Please enter a valid commit hash from the issue.</RcB.Form.Text>
                    </RcB.Form.Group>
                </RcB.Modal.Body>
                    <RcB.Modal.Footer>
                        <RcB.Button variant="secondary" onClick={() => { this.closeModal.call(this, true) }}>
                            Close
          </RcB.Button>
                        <RcB.Button variant="secondary" type="submit" value="Submit" onClick={() => { this.closeModal.call(this, true) }}>
                            Submit
          </RcB.Button>
                    </RcB.Modal.Footer></form>
            </RcB.Modal>
            </RcB.Container>
        </div>
        )

    }
}

export default Dev;