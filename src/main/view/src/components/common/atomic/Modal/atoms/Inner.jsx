import {styled, css} from 'styled-components';

const Inner = styled.div`
  width: 100%;
  height: calc(100% - 150px);
  padding: 15px;
  box-sizing: border-box;
  overflow-y: auto;
  transition: all ease 3s;
  background-image: linear-gradient(white, white);
  background-color: transparent;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #babac0;
    transition: background-color 0.3s ease;
  }

  &::-webkit-scrollbar {
    width: 10px;
  }
  
  &::-webkit-scrollbar-button {
      width: 0;
      height: 0;
      display: none;
  }  

  &:hover {
    background-color: #babac0;
    transition: background-color 0.3s ease;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: inherit;
    border-radius: 8px;
    border: 3px solid transparent;
    background-clip: content-box;
    transition: background-color 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:active {
    background-color: #b0b0b8;
  }

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
