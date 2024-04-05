export interface Ingredient {
    id: string;
    content: string;
}

export interface Step {
    id: string;
    content: string;
    stepNumber: number;
}

export interface ImageSource {
    originalName: string;
    uuidName: string;
    url: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Recipe {
    id?: string;
    authorId: string;
    title: string;
    description: string;
    tags: string[];
    ingredients: Ingredient[];
    steps: Step[];
    likedBy: string[];
    prepTime: string;
    cookingTime: string;
    portions: number;
    allergens: string[];
    difficulty: Difficulty;
    ratings: number[];
    imageSources: ImageSource[];
}
