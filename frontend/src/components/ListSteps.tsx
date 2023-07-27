import { useCallback } from 'react';
import { Recipe, Step } from '../app/types';
import AddStep from './AddStep';
import { Card } from './Card';

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
                        <li>
                            {`${step.content} `}
                            <button
                                type='button'
                                onClick={() => handleRemoveStep(step)}
                            >
                                X
                            </button>
                        </li>
                    }
                    moveCard={moveStep}
                />
            );
        },
        [setRecipe]
    );

    return (
        <div>
            <label>Steps:</label>
            <ol>
                {steps.map((step, i) => renderStep(step, i))}
                <li>
                    <AddStep
                        setRecipe={setRecipe}
                        numberOfSteps={steps.length as number}
                    />
                </li>
            </ol>
        </div>
    );
};

export default ListSteps;
