export interface ImageSource {
    originalName: string;
    uuidName: string;
}

export interface ImageDataPayload {
    image: string;
    fileExt: string;
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

export interface Tag {
    name: string;
    count: number;
}
