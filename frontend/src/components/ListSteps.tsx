import { useCallback } from 'react';
import { Recipe, Step } from '../app/types';
import AddStep from './AddStep';
import { Card } from './Card';
import styled from 'styled-components';

interface ListStepsProps {
    steps: Step[];
    setRecipe: React.Dispatch<React.SetStateAction<Partial<Recipe>>>;
}

const ListSteps = ({ steps, setRecipe }: ListStepsProps) => {
    const renderStep = useCallback(
        (step: Step, index: number) => {
            const reorderStepNumbers = (steps: Step[]) =>
                steps.map((step, i) => ({
                    ...step,
                    stepNumber: i + 1,
                }));

            const moveStep = (dragIndex: number, hoverIndex: number) => {
                setRecipe((prevRecipe) => {
                    const clonedSteps = [...(prevRecipe.steps as Step[])];
                    const [draggedStep] = clonedSteps.splice(dragIndex, 1);
                    clonedSteps.splice(hoverIndex, 0, draggedStep);

                    return {
                        ...prevRecipe,
                        steps: reorderStepNumbers(clonedSteps),
                    };
                });
            };

            const handleRemoveStep = (stepToRemove: Step) => {
                setRecipe((prevRecipe) => ({
                    ...prevRecipe,
                    steps: reorderStepNumbers(
                        prevRecipe.steps?.filter(
                            (step) => step !== stepToRemove
                        ) as Step[]
                    ),
                }));
            };

            return (
                <Card
                    key={step.id}
                    index={index}
                    id={step.id}
                    content={
                        <StepItem>
                            <StepWrapper>
                                {`${step.content} `}
                                <RemoveButton
                                    type='button'
                                    onClick={() => handleRemoveStep(step)}
                                >
                                    X
                                </RemoveButton>
                            </StepWrapper>
                        </StepItem>
                    }
                    moveCard={moveStep}
                />
            );
        },
        [setRecipe]
    );

    return (
        <div>
            <Label>Steps:</Label>
            <StepsList>
                {steps.map((step, i) => renderStep(step, i))}
                <StepItem>
                    <AddStep
                        setRecipe={setRecipe}
                        numberOfSteps={steps.length as number}
                    />
                </StepItem>
            </StepsList>
        </div>
    );
};

const Label = styled.label`
    color: #555;
    margin-bottom: 0.3rem;
`;

const StepItem = styled.li`
    color: #555;
    margin-bottom: 0.3rem;
    width: 100%;
`;

const StepWrapper = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
`;

const RemoveButton = styled.button`
    padding: 0.3rem 0.6rem;
    color: #fff;
    background-color: #dc3545;
    border: none;
    border-radius: 0.3rem;
    cursor: pointer;

    &:hover {
        background-color: #c82333;
    }
`;

const StepsList = styled.ol`
    padding: 0;
    margin-left: 1.2rem;
`;

export default ListSteps;
