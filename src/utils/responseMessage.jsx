import {Alert} from 'react-bootstrap'

const ResponseMessage = ({success, successText, failureText}) => {
    if (success === null || success === undefined || (success && !successText) || (!success && !failureText)) {
        return <></>
    }

    if (success) {
        return (
            <Alert variant={'success'}>
                {successText}
            </Alert>
        )
    } else {
        return (
            <Alert variant={'danger'}>
                {failureText}
            </Alert>
        )
    }
}

export default ResponseMessage
