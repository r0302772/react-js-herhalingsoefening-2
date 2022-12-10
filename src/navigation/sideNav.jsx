import {Col, Row} from 'react-bootstrap'

const SideNav = () => {
    return (
        <Row className="d-flex flex-column align-content-stretch h-100 w-100 g-0">
            <Col className="flex-grow-1 mt-4 g-0">
                {/* navigation links */}
            </Col>
            <Col className="flex-grow-0 g-0">
                <Row className="g-0">
                    <Col xs={10} className={`d-flex`}>
                        {/* Dark Theme Switch */}
                    </Col>
                    <Col className={`d-flex`} xs={2}>
                        {/* Expand toggle */}
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default SideNav
