import React, {useState, useEffect} from 'react'

import { Alert } from 'reactstrap';

const Notification = (props) => {
   
    const [visible, setVisible] = useState(false);

    const onDismiss = () => setVisible(false);
  
    const { type, message } = props;

    useEffect((visible) => {
        if (!visible) {
            setVisible(true);
            setTimeout(onDismiss, 6000);
            console.log("settimeout");
        }
    }, [message])

    return (
        <div className="notification">
            <Alert
                color={type}
                isOpen={visible}
                toggle={onDismiss}
                onChange={useEffect}
            >
                {message}
            </Alert>
        </div>
    );
  }
  
  export default Notification;