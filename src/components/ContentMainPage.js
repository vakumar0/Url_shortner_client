import React, { Component } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form, Button, Row, Col } from 'react-bootstrap';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { Grid } from './Grid';
import moment from 'moment';


class Content extends Component {

    constructor() {
        super();
        this.state = {
            isCustomUrl: false,
            isExpiryDate: false,
            allURLS: [],
            isGridVisible: false,
            isPasswordEnabled: false,
            isLoggingEnabled: false,
            yesterday: moment().subtract( 1, 'day' ),
            expiryDate: null,
            message: '',
            color: 'red',
            shortUrl: '',
            ipAddress: ''            
        };        
        this.customUrlCheckClick = this.customUrlCheckClick.bind(this);
        this.expiryDateCheckClick = this.expiryDateCheckClick.bind(this);
        this.getAllURLS = this.getAllURLS.bind(this);
        this.hideShowGrid = this.hideShowGrid.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loggingCheckClick = this.loggingCheckClick.bind(this);
        this.passwordCheckClick = this.passwordCheckClick.bind(this);
        this.validDate = this.validDate.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.getIPAddress = this.getIPAddress.bind(this);
    }
            
    validDate(current) {
        return current.isAfter( this.state.yesterday );
    }

    handleDateChange(date) {
        this.setState({expiryDate: date.format("YYYY-MM-DD hh:mm:ss")});
    }

    loggingCheckClick() {
        this.setState({ isLoggingEnabled: !this.state.isLoggingEnabled});
    }

    passwordCheckClick() {
        this.setState({ isPasswordEnabled: !this.state.isPasswordEnabled});
    }

    customUrlCheckClick() {
        this.setState({ isCustomUrl: !this.state.isCustomUrl});
    }

    expiryDateCheckClick() {
        this.setState({ isExpiryDate: !this.state.isExpiryDate});
    }

    getAllURLS() {
        //fetch('http://127.0.0.1:8000/api/getAllURLs')
        fetch('https://vakumar-urlshortner.herokuapp.com/api/getAllURLs')
        .then( response => response.json())
        .then( urls => this.setState({allURLS: urls}));
    }

    hideShowGrid() {
        if(this.state.isGridVisible === false) 
            this.getAllURLS();
        this.setState({ isGridVisible: !this.state.isGridVisible});
    }

    handleSubmit(event) {
        event.preventDefault()
        let currentTime = new Date().toLocaleString();
        this.setState({shortUrl : ''});
        const info = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {
                original_url: event.target.original_url.value,
                is_password_protected: this.state.isPasswordEnabled,
                password: this.state.isPasswordEnabled? event.target.url_password.value : null,
                is_logging_enabled: this.state.isLoggingEnabled,
                is_expiry_enabled: this.state.isExpiryDate,
                expiry_time: this.state.isExpiryDate ? this.state.expiryDate :null,
                created_by: this.state.ipAddress !== undefined? this.state.ipAddress: 'admin',
                created_on: moment(currentTime).format("YYYY-MM-DD hh:mm:ss"),
                is_custom_url: this.state.isCustomUrl,
                custom_url: this.state.isCustomUrl ? event.target.custom_short_url.value : null,
                origin: window.location.origin
            })            
        }
        
        fetch('https://vakumar-urlshortner.herokuapp.com/api/getShortUrl', info)
        .then( response => response.json())
        .then( data => {
            console.log(data);
            data.is_success === false ? this.setState({color: 'red'}) : this.setState({color: 'green'});
            this.setState({shortUrl: data.url});
            this.setState({message: data.message});           
        });
    }

    getIPAddress() {
        fetch("https://ipinfo.io/json")
        .then((response) => response.json())
        .then((data) => this.setState({ipAddress: data.ip}));
    }

    componentDidMount() {        
        var url = window.location.href;
        if(url.indexOf('?') !== -1) {
            let openUrl = 'https://vakumar-urlshortner.herokuapp.com/' + url.replace('https://vakumar-urlshortner.herokuapp.com/','');
            //let openUrl = window.location.origin + '/' + url.replace('http://localhost:3000/?','');
            fetch(openUrl)
            .then( response => response.json())
            .then( data => {
                data.is_success ? this.setState({color: 'red'}) : this.setState({color: 'green'});
                this.setState({message: data.message});   
                if(data.is_success) 
                    window.open(data.message, "_self");                
            });
        }        

        this.getIPAddress();
      }

    render() {
        return (
            <>
              <div className="contentPage" >                  
                  <div className="contentPage-container">
                    <form onSubmit={this.handleSubmit}>
                    {/* <Form className="mb-5"> */}
                        <Row className="justify-content-md-center mb-2 height_40px">
                            <Col xs lg="3">
                                <Form.Control type="original_url" name="original_url" placeholder="Paste URL..."></Form.Control>
                            </Col>
                            <Col md="auto">
                                <Form.Check label="Enable logs" name="group1" type="checkbox" id="is_logging_enabled" onChange={() => this.loggingCheckClick('isCustomUrl')}></Form.Check>                                
                            </Col>   
                        </Row>                     
                        <Row className="justify-content-md-center mb-2 height_40px">
                            <Col xs lg="3">
                                { this.state.isCustomUrl ? (<Form.Control type="custom_short_url" name="custom_short_url" placeholder="url should start with => http://localhost:3000/?"></Form.Control>) : (<Form.Control type="custom_short_url" placeholder="Custom URL..." value={this.state.shortUrl} readOnly ></Form.Control>) }                                
                            </Col>  
                            <Col md="auto">
                                <Form.Check label="Custom Url" name="group1" type="checkbox" id="custom_url" onChange={() => this.customUrlCheckClick('isCustomUrl')}></Form.Check>    
                            </Col>                  
                        </Row>  
                        <Row className="justify-content-md-center mb-2 height_40px">
                            <Col xs lg="3">                                
                                { this.state.isExpiryDate ? (<Datetime onChange={ this.handleDateChange} isValidDate= {this.validDate}/>) : <Datetime inputProps={{disabled: true}} />}                                  
                            </Col>  
                            <Col md="auto">
                                <Form.Check label="Expiry Time" name="group1" type="checkbox" id="expiry_time" onChange={() => this.expiryDateCheckClick('expiryDateCheckClick')}></Form.Check>
                            </Col>                                
                        </Row>  
                        <Row className="justify-content-md-center mb-4 height_40px">
                            <Col xs lg="3">
                                { this.state.isPasswordEnabled ? (<Form.Control type="password" name="url_password" placeholder="password..." ></Form.Control>) : (<Form.Control type="custom_short_url" name="url_password" placeholder="password..." readOnly ></Form.Control>) }                                
                            </Col>  
                            <Col md="auto">
                                <Form.Check label="Password  ." name="group1" type="checkbox" id="password" onChange={() => this.passwordCheckClick('isPasswordEnabled')}></Form.Check>    
                            </Col>                  
                        </Row>    
                        <Row className="justify-content-md-center">
                            <p style={{color: this.state.color}}>{this.state.message}</p>
                        </Row>                        
                        <Row className="justify-content-md-center mb-4">
                            <Col  xs lg="2">
                                <Button variant="outline-primary" type="submit" value="Submit">{this.state.isCustomUrl ? ('Save URL'): ('Shorten URL')  }</Button>
                                {/* <Button variant="outline-primary" onClick={this.handleSubmit}>{this.state.isCustomUrl ? ('Save URL'): ('Shorten URL')  }</Button> */}
                            </Col >
                            <Col xs lg="2">
                                <Button variant="outline-primary" onClick={() => this.hideShowGrid()}>{this.state.isGridVisible ? ('Hide All URLs') : ('View All URLs')}</Button>
                            </Col> 
                        </Row>                                                                                 
                    </form>
                    {this.state.isGridVisible ? (<Grid gridData={this.state.allURLS}></Grid>): null}                    
                    <p>&copy; Developed by Vaibhav Kumar</p>
                  </div>
              </div>
            </>
        )
    }
}

export default Content;