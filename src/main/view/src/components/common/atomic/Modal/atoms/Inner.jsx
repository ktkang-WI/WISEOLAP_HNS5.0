import {styled, css} from 'styled-components';

const Inner = styled.div`
  width: 100%;
  height: calc(100% - 100px);
  padding: 20px;
  box-sizing: border-box;

  ${(props) => props.usePage && css`
    .modal-page{
      display: none;
    }
    
    .modal-page:nth-child(${(props) => props.currentPage}){
      display:block;
    }
  `}
`;

export default Inner;
