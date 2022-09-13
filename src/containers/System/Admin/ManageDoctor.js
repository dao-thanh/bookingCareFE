import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageUser.scss';
import * as actions from "../../../store/actions"
import './ManageDoctor.scss';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

import Select from 'react-select';
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils';
import { getDetailInforDoctor } from '../../../services/userService';


// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);




class ManageDoctor extends Component {

   constructor(props) {
       super(props);
       this.state = {
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: null,
            description: '',
            listDoctors: [],
            hasOldData: false
       }
   }

   componentDidMount() {
        this.props.fetchAllDoctorsRedux();
   }

   buildDataInputSelect = (inputData) => {
        let result = [];
        let {language} = this.props;
        if(inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label =  language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            })
        }
        return result;
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
     if(prevProps.allDoctors !== this.props.allDoctors) {
         let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
         this.setState({
             listDoctors: dataSelect
         })
     }
     if(prevProps.language !== this.props.language) {
        let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
        this.setState({
            listDoctors: dataSelect
        })
     }


   }

   // Finish!
   handleEditorChange =  ({ html, text }) =>  {
    this.setState({
        contentMarkdown: text,
        contentHTML: html
    })
   }
   
   handleSaveContentMarkdown = () => {
       let {hasOldData} = this.state;

       this.props.saveDetailDoctorActionRedux({
        contentHTML: this.state.contentHTML,
        contentMarkdown: this.state.contentMarkdown,
        description: this.state.description,
        doctorId: this.state.selectedOption.value,
        action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE
       })
       console.log('check state', this.state);
   }
   
   handleChangeSelect = async(selectedOption) => {
        this.setState({ selectedOption });
        console.log(selectedOption.value)
        let res = await getDetailInforDoctor(selectedOption.value);
        if(res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;
            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true
            })
        }else{
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false
            })
        }
        console.log(res)
   }

   handleOnChangeDesc = (event) => {
       this.setState({
            description: event.target.value
       })
   }
    render() {
        console.log('it', this.state.listDoctors)
        let {hasOldData} = this.state;
        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>
                    Tạo thêm thông tin bác sỹ
                </div>
                <div className='more-infor'>
                    <div className='content-left form-group'>
                        <label>Chọn bác sĩ</label>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctors}
                        />
                    </div>
                    <div className='content-right'>
                    <label>Thông tin giới thiệu:</label>
                        <textarea className='form-control' rows='4'
                            onChange={(event) => this.handleOnChangeDesc(event)}
                            value={this.state.description}
                            >
                            abccsfdfrdfd
                        </textarea>
                    </div>
                </div>
                <div className='manage-doctor-editor'>
                  <MdEditor style={{ height: '500px' }} 
                    renderHTML={text => mdParser.render(text)} 
                    onChange={this.handleEditorChange} 
                    value={this.state.contentMarkdown}
                  />
                </div>
                <button 
                    onClick={() => this.handleSaveContentMarkdown()}
                    className={hasOldData === true ? 'save-content-doctor' : 'create-content-doctor' } >
                    {hasOldData === true ?
                        <span>Lưu thông tin</span> : <span>Tạo thông tin</span>
                    }
                </button>
               
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
        saveDetailDoctorActionRedux: (data) => dispatch(actions.saveDetailDoctorAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
  