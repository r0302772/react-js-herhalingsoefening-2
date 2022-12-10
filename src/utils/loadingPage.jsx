import styled from 'styled-components'

const LoadingPage = styled.span`
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 10em;
  height: 10em;
  flex-grow: 1;
  transform: rotateZ(45deg);
  perspective: 1000px;
  border-radius: 50%;
  color: #2b2b2b;

  :before, :after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: inherit;
    height: inherit;
    border-radius: 50%;
    transform: rotateX(70deg);
    animation: 1s spin linear infinite;
  }

  :after {
    color: #FF3D00;
    transform: rotateY(70deg);
    animation-delay: .4s;
  }
  
  @keyframes spin {
    0%,
    100% {
      box-shadow: .2em 0 0 0 currentcolor;
    }
    12% {
      box-shadow: .2em .2em 0 0 currentcolor;
    }
    25% {
      box-shadow: 0 .2em 0 0 currentcolor;
    }
    37% {
      box-shadow: -.2em .2em 0 0 currentcolor;
    }
    50% {
      box-shadow: -.2em 0 0 0 currentcolor;
    }
    62% {
      box-shadow: -.2em -.2em 0 0 currentcolor;
    }
    75% {
      box-shadow: 0 -.2em 0 0 currentcolor;
    }
    87% {
      box-shadow: .2em -.2em 0 0 currentcolor;
    }
  }

`

export default LoadingPage;
