import { ChangeEvent, useState } from 'react';
import { Step, Recipe } from '../app/types';

interface AddStepProps {
    setRecipe: React.Dispatch<React.SetStateAction<Partial<Recipe>>>;
    numberOfSteps: number;
}

const AddStep = ({ setRecipe, numberOfSteps }: AddStepProps) => {
    const initialStepState: Step = {
        stepNumber: 0,
        content: '',
    };
    const [newStep, setNewStep] = useState<Step>(initialStepState);

    const disableAdd: boolean = newStep.content === '';

    const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
        const { value } = ev.target;

        setNewStep({
            content: value,
            stepNumber: numberOfSteps + 1,
        });
    };

    const handleAddStep = (
        ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        ev.preventDefault();

        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            steps: [...(prevRecipe.steps as Step[]), newStep],
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
