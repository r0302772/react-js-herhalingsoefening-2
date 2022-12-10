import {Col, Container, Row} from 'react-bootstrap'
import SideNav from './navigation/sideNav.jsx'

const App = () => {
    return (

        <Container fluid className={`vh-100 bg-dark text-light`}>
            <Row className="h-100">
                <Col lg={2} className="border-end border-secondary vh-100 mx-auto d-flex justify-content-center">
                   <SideNav/>
                </Col>
                <Col className="vh-100">
                    <Row className="justify-content-center">
                        {/* PLAATS DE ROUTING COMPONENT HIER */}
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default App
