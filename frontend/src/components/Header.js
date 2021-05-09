import  {Component} from 'react';

class Header extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div>
                Ethereum Address is: {this.props.address}
            </div>
        )
    }
}

export default Header;