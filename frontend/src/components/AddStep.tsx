import { ChangeEvent, useState } from 'react';
import { Step, Recipe } from '../app/types';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';

interface AddStepProps {
    setRecipe: React.Dispatch<React.SetStateAction<Partial<Recipe>>>;
    numberOfSteps: number;
}

const AddStep = ({ setRecipe, numberOfSteps }: AddStepProps) => {
    const initialStepState: Step = {
        id: '',
        stepNumber: 0,
        content: '',
    };
    const [newStep, setNewStep] = useState<Step>(initialStepState);

    const disableAdd: boolean = newStep.content === '';

    const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
        const { value } = ev.target;

        setNewStep((prevNewStep) => ({
            ...prevNewStep,
            content: value,
            stepNumber: numberOfSteps + 1,
        }));
    };

    const handleAddStep = (
        ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        ev.preventDefault();

        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            steps: [
                ...(prevRecipe.steps as Step[]),
                { ...newStep, id: uuidv4() },
            ],
        }));

        setNewStep(initialStepState);
    };

    return (
        <Wrapper>
            <StepContainer>
                <Input
                    type='text'
                    name='content'
                    value={newStep.content}
                    onChange={handleInputChange}
                />
            </StepContainer>

            <StepContainer>
                <AddButton onClick={handleAddStep} disabled={disableAdd}>
                    Add
                </AddButton>
            </StepContainer>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 1.3rem;
    border-top: 0.06rem solid #555;
    padding-top: 1rem;
`;

const StepContainer = styled.div``;

const Input = styled.input`
    padding: 0.5rem;
    border: 0.06rem solid #ccc;
    border-radius: 0.3rem;
    margin-bottom: 0.6rem;
    width: calc(100% - 1.2rem);
`;

const AddButton = styled.button`
    padding: 0.6rem 1.3rem;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 0.3rem;
    cursor: pointer;
    position: relative;
    right: 1.2rem;

    &:hover {
        background-color: #0056b3;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

export default AddStep;
