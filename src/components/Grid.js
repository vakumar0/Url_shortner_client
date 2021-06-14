import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';

export const Grid = props => (
    <div className="showAllURLSGrid">
        <Table striped bordered hover  >
        <thead>
                <tr>
                    <th>#</th>
                    <th>Short URL</th>                    
                    <th>Password Protected</th>
                    <th>logging Enabled</th>
                    <th>Expiry Enabled</th>
                    <th>Expirt Time</th>
                    <th>Created By</th>
                    <th>Created On</th>
                </tr>                                
            </thead>                           
            <tbody>
                {
                    props.gridData.map( data => {
                        return (
                            <tr key={data.id}>
                                <td>{data.id}</td>
                                <td >{data.short_url}</td>                                
                                <td>{data.is_password_protected}</td>
                                <td>{data.is_logging_enabled}</td>
                                <td>{data.is_expiry_enabled}</td>
                                <td>{data.expiry_time}</td>
                                <td>{data.created_by}</td>
                                <td>{data.created_on}</td>
                            </tr>     
                        )
                    })
                }
            </tbody>
            {/* <thead>
                <tr class="d-flex">
                    <th>#</th>
                    <th >Short URL</th>
                    <th >Original URL</th>
                    <th>Password Protected</th>
                    <th>logging Enabled</th>
                    <th>Expiry Enabled</th>
                    <th>Expirt Time</th>
                    <th>Created By</th>
                    <th>Created On</th>
                </tr>                                
            </thead>                           
            <tbody>
                {
                    props.gridData.map( data => {
                        return (
                            <tr key={data.id} class="d-flex">
                                <td>{data.id}</td>
                                <td >{data.short_url}</td>
                                <td >{data.original_url}</td>
                                <td>{data.is_password_protected.data[0]}</td>
                                <td>{data.is_logging_enabled.data[0]}</td>
                                <td>{data.is_expiry_enabled.data[0]}</td>
                                <td>{data.expiry_time}</td>
                                <td>{data.created_by}</td>
                                <td>{data.created_on}</td>
                            </tr>     
                        )
                    })
                }
            </tbody> */}
        </Table>
        <div className="test">{props.children}</div>
    </div>
);
