import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { postVerifyBookAppointment } from '../../services/userService';
import HomeHeader from '../HomePage/HomeHeader';
import './VerifyEmail.scss';

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
             statusVerify: false,
             errCode: 0
        }
    }
 
    async componentDidMount() {
        console.log('props', this.props)
        if(this.props.location && this.props.location.search) {
            let params = new URLSearchParams(this.props.location.search);
            let token = params.get('token');
            let doctorId = params.get('doctorId');
            let res = await postVerifyBookAppointment({
                token: token,
                doctorId: doctorId
            })

            if(res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode
                })
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1
                })
            }
        }
        

        // if(this.props.match && this.props.match.params && this.props.match.params.id) {

        // }    
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.language !== prevProps.language) {

        }

    }

    render() {
        let {statusVerify, errCode} = this.state;
        return (
            <>
                <HomeHeader/>
                <div className='verify-email-container'>
                    {statusVerify === false ?
                        <div>
                            Loading data ...
                        </div>
                        :
                        <div>
                            {+errCode === 0 ?
                                <div className='infor-booking'>
                                     Xác nhận lịch hẹn thành công
                                </div>
                                :
                                <div className='infor-booking'>
                                    Lịch hẹn không tồn tại hoặc đã được xác nhận
                                </div>    
                            }
                        </div>
                    }
                </div>
               
            </>
           
        );
    }
}

const mapStateToProps = state => {
    return {
        doctorRedux: state.admin.doctor,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
       
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
