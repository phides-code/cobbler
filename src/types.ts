export interface ImageSource {
    originalName: string;
    uuidName: string;
}

export interface Recipe {
    id?: string;
    author: string;
    title: string;
    description: string;
    tags: string[];
    ingredients: string[];
    steps: string[];
    likes: number;
    prepTime: string;
    imageSource: ImageSource;
}

export interface ImageServiceAPIResponse {
    data: string | null;
    errorMessage: string | null;
}
