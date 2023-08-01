import { ObjectId } from 'mongodb';

export const cuisines = [
    'Portuguese',
    'Mexican',
    'Italian',
    'Indian',
    'Chinese',
    'Japanese',
    'Thai',
    'French',
    'Spanish',
    'Greek',
    'Mediterranean',
    'American',
    'Brazilian',
    'Vietnamese',
    'Korean',
    'Turkish',
    'Lebanese',
    'Moroccan',
    'Russian',
    'Peruvian',
    'Argentinian',
    'Australian',
    'British',
    'Cajun',
    'Caribbean',
    'Ethiopian',
    'Swedish',
    'Swiss',
    'South African',
    'Egyptian',
    'Irish',
    'Indonesian',
    'Israeli',
    'Nigerian',
    'Polish',
    'Scottish',
    'Tunisian',
    'International',
    'Unconventional',
] as const;

export const foodTypes = [
    'Entree',
    'Main',
    'Side',
    'Snack',
    'Dessert',
    'Dressing',
    'Lunch',
    'Dinner',
    'Breakfast',
    'Brunch',
] as const;

export const recipeListType = ['AUTHORED', 'LIKED', 'ALL'] as const;

export type Cuisine = (typeof cuisines)[number];

export type FoodType = (typeof foodTypes)[number];

export type RecipeListType = (typeof recipeListType)[number];

export interface Recipe {
    _id: ObjectId;
    authorId: string;
    title: string;
    description: string;
    type: FoodType[];
    cuisine: Cuisine;
    ingredients: Ingredient[];
    steps: Step[];
    likedBy: string[];
}

export interface Ingredient {
    id: string;
    ingredientName: string;
    quantity: string;
    unit: string;
}

export interface Step {
    id: string;
    stepNumber: number;
    content: string;
}

export interface User {
    name?: string;
    given_name?: string;
    family_name?: string;
    middle_name?: string;
    nickname?: string;
    preferred_username?: string;
    profile?: string;
    picture?: string;
    website?: string;
    email?: string;
    email_verified?: boolean;
    gender?: string;
    birthdate?: string;
    zoneinfo?: string;
    locale?: string;
    phone_number?: string;
    phone_number_verified?: boolean;
    address?: string;
    updated_at?: string;
    sub?: string;
    authoredRecipes?: string[];
    likedRecipes?: string[];
    _id: ObjectId;
}

export interface LikeUnlikeRecipeProps {
    recipeId: string;
    type: 'like' | 'unlike';
    userId: string;
}
