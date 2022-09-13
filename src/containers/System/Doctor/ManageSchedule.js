import React, { Component } from 'react';
import { connect } from "react-redux";


class ManageSchedule extends Component {
    render() {
         
        const { isLoggedIn } = this.props;
        return (
            <React.Fragment>
              <div>
                  Manage Schedule
              </div>
            </React.Fragment>
           
        );
    }
}

const mapStateToProps = state => {
    return {
        ManageScheduleMenuPath: state.app.ManageScheduleMenuPath,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
