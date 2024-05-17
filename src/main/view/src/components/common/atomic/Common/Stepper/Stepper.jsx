import {Fragment, useState} from 'react';
import styled from 'styled-components';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';

const theme = getTheme();

const StyledStepper = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: ${theme.color.panelColor};
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
  color: ${(props) => props.active ? theme.color.white : theme.color.primary};
  background-color:${(props) => props.active ?
    theme.color.dataColumnBorder :
    (props.prev ? theme.color.dataColumnBorder : 'transparent')};
  border: 2px solid ${(props) => props.active ?
    theme.color.dataColumnBorder : theme.color.primary};
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
    theme.color.black : (props.prev ? theme.color.black : theme.color.primary)};
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
  background-color: ${theme.color.primary};
  color: ${theme.color.white};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${theme.color.primaryHover};
  }
`;

const StyledContent = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 35px;
  display: flex;
  justify-content: center;
`;

const StepText = styled.div`
  width: 270px;
  height: 40px;
  font-size: 12px;
  color: ${theme.color.black};
  position: absolute;
  text-align: center;
  top: 30px;
  margin-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
          <Fragment key={index}>
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
          </Fragment>
        ))}
      </StyledSteps>
      <StyledContent>
        {steps[activeStep].content}
      </StyledContent>
      <NavigationButtons>
        {activeStep >= 1 ?
          <StyledButton
            onClick={goToPreviousStep}>
            {localizedString.prevStep}
          </StyledButton> : <></>}
        {activeStep < steps.length -1 ?
          <StyledButton
            onClick={goToNextStep}>
            {localizedString.nextStep}
          </StyledButton> : <></>}
        {activeStep === steps.length - 1 ?
          <StyledButton
            onClick={onComplete}>
            {localizedString.completeStep}
          </StyledButton> : <></>}
      </NavigationButtons>
    </StyledStepper>
  );
};

export default Stepper;
