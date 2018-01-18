import{bindActionCreators} from 'redux';
import{connect} from 'react-redux';
import RootCanvas from '../../components/NormalCanvas.jsx';
import * as SocketClusterActions from '../actions/controlleractions';

function mapStateToProps(state){
	return{
		controller:state.controller,
		restaurantposts:state.restaurantposts
		
	};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators(SocketClusterActions,dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(RootCanvas);
