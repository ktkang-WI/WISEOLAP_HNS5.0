import React, {useState} from 'react';
import styled from 'styled-components';

const StyledStepper = styled.div`
  box-sizing: border-box;
  width: 100%;
  background-color: #f1f1f1;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledSteps = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const StepLabel = styled.div`
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.active ? 'white' : '#999'};
  background-color:${(props) => props.active ?
    '#c1c1c1' : (props.prev ? '#c1c1c1' : 'transparent')};
  border: 2px solid ${(props) => props.active ?'#c1c1c1' : '#999'};
  border-radius: 50%;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
`;

const StepLine = styled.div`
  width: 250px;
  height: 2px;
  background-color: ${(props) => props.active ?
    'black' : (props.prev ? 'black' : '#999')};
  position: relative;
  top: 16px;
  z-index: 0;
`;

const NavigationButtons = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: right;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  margin-left: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const StyledContent = styled.div`
  width: 100%;
  margin-top: 35px;
  display: flex;
  justify-content: center;
`;

const StepText = styled.div`
  width: 270px;
  height: 40px;
  font-size: 12px;
  color: #333;
  position: absolute;
  text-align: center;
  top: 30px;
  margin-top: 5px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
`;

const Checkmark = styled.div`
  font-size: 18px;
`;

const Stepper = ({
  steps, // required
  onComplete
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const goToNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <StyledStepper>
      <StyledSteps>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {
              index > 0 &&
              <StepLine
                active={index === activeStep}
                prev={index < activeStep} />
            }
            <div>
              <StepLabel
                active={index === activeStep}
                prev={index < activeStep}
                onClick={() => setActiveStep(index)}>
                <Checkmark>{index <= activeStep ? '✔️' : ''}</Checkmark>
                <StepText>{step.label}</StepText>
              </StepLabel>
            </div>
          </React.Fragment>
        ))}
      </StyledSteps>
      <StyledContent>
        {steps[activeStep].content}
      </StyledContent>
      <NavigationButtons>
        {activeStep >= 1 ?
          <StyledButton
            onClick={goToPreviousStep}>
              이전
          </StyledButton> : <></>}
        {activeStep < steps.length -1 ?
          <StyledButton
            onClick={goToNextStep}>
              다음
          </StyledButton> : <></>}
        {activeStep === steps.length - 1 ?
          <StyledButton
            onClick={onComplete}>
              완료
          </StyledButton> : <></>}
      </NavigationButtons>
    </StyledStepper>
  );
};

export default Stepper;
