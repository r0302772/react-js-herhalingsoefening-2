import {Button, ProgressBar} from 'react-bootstrap'
import styled from 'styled-components'

const StyledProgressBar = styled(ProgressBar)`
  // Ensure that the button has the same height when showing the loading bar.
  height: 1.5rem
`
/**
 *
 * @param loading {boolean} Indicates whether some network request is in progress.
 * @param text {string} The text to show when loading is false.
 * @param loadingText {string} The text to show in the button when loading is true.
 */
const FormSubmitButtonWithLoading = ({loading, text, loadingText}) => {
    return (
        <div className={'d-grid'}>
            <Button variant="primary" disabled={loading} type="submit">
                {loading ? <StyledProgressBar striped variant="info" now={100} animated label={loadingText}/> : text}
            </Button>
        </div>
    )
}

export default FormSubmitButtonWithLoading
