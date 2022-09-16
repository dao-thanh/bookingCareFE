import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailDoctor.scss'
import * as actions from "../../../store/actions"
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';

class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1
        }
    }
    componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            this.setState({
                currentDoctorId: id
            })
            this.props.fetchDetailDoctorRedux(id);
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.doctorRedux !== this.props.doctorRedux) {
            this.setState({
                detailDoctor: this.props.doctorRedux
            })
        }   
    }
    
    
    render() {
        console.log( this.state)
        let {language} = this.props
        let {detailDoctor} = this.state;
        let nameVi = '',  nameEn = '';
        if(detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName} `;
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}, `
        }
       
        return (
            <>
                <HomeHeader  isShowBanner={false}/>
                <div className='doctor-detail-container'>
                    <div className='intro-doctor'>
                        <div className='content-left'
                         style={{backgroundImage: `url(${detailDoctor.image})` }}>

                        </div>
                        <div className='content-right'>
                            <div className='up'>
                                {language === LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            <div className='down'>
                               {detailDoctor.Markdown && detailDoctor.Markdown.description 
                               && <span>
                                   {detailDoctor.Markdown.description}
                               </span>
                               } 
                            </div>
                        </div>
                    </div>
                    <div className='schedule-doctor'>
                        <div className='content-left'>
                            <DoctorSchedule 
                            doctorIdFromParent={this.state.currentDoctorId}/>
                        </div>
                        <div className='content-right'>

                        </div>
                    </div>
                    <div className='detail-infor-doctor'>
                        {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML
                            && <div dangerouslySetInnerHTML={{__html:detailDoctor.Markdown.contentHTML}}>
                                  
                               </div>
                        }
                    </div>
                    <div className='comment-doctor'>

                    </div>
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
        fetchDetailDoctorRedux: (id) => dispatch(actions.fetchDetailDoctor(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
