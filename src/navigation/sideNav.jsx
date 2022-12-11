import {Col, Row, Nav} from 'react-bootstrap'
import styled from "styled-components";
import {LinkContainer} from 'react-router-bootstrap'
import {useState} from "react";

const SideNavContainer = styled(Row)`
  *:focus {
    outline: none;
  }
`

const navlinks = [
    {path: "/", icon: "bi-house-door-fill", title: "Social Network", isTitleWebsite: true},
    {path: "/user", icon: "bi-person-fill", title: "Username"},
    {path: "/login", icon: "bi-box-arrow-in-right", title: "Login"},
    {path: "/groups", icon: "bi-people-fill", title: "Groups"},
    {path: "/chat", icon: "bi-chat-fill", title: "Chat"}
]

const SideNav = () => {
    const [isActive, setIsActive] = useState(navlinks[0].title);
    const [isOpen, setIsOpen] = useState(true);

    return (
        <SideNavContainer>
            <Row className="d-flex flex-column align-content-stretch h-100 w-100 g-0">
                <Col className="flex-grow-1 mt-4 g-0">
                    {navlinks.map(n =>
                        <LinkContainer key={n.path} to={n.path}>
                            <Nav.Link className={isActive === n.title && "text-muted"}
                                      onClick={() => setIsActive(n.title)}>
                                {n.isTitleWebsite ?
                                    <>
                                        <h3>
                                            <i className={n.icon}></i> {isOpen && n.title}
                                        </h3>
                                        <hr/>
                                    </>
                                    :
                                    <h4>
                                        <i className={n.icon}></i> {isOpen && n.title}
                                    </h4>}
                            </Nav.Link>
                        </LinkContainer>
                    )}
                </Col>
                <Col className="flex-grow-0 g-0">
                    <Row className="g-0">
                        <Col xs={10} className={`d-flex`}>
                            {/* Dark Theme Switch */}
                        </Col>
                        <Col className={`d-flex`} xs={2}>
                            <i className={isOpen ? "bi-arrow-left" : "bi-arrow-right"} onClick={() => setIsOpen(x => !x)}></i>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </SideNavContainer>
    )
}

export default SideNav