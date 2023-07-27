import { ChangeEvent, useState } from 'react';
import { Step, Recipe } from '../app/types';
import { v4 as uuidv4 } from 'uuid';

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
        <>
            <div>
                <input
                    type='text'
                    name='content'
                    value={newStep.content}
                    onChange={handleInputChange}
                />
            </div>

            <button onClick={handleAddStep} disabled={disableAdd}>
                Add
            </button>
        </>
    );
};

export default AddStep;
