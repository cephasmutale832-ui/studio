import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Ensure that placeholderImages is an array, even if the JSON is malformed or empty.
export const PlaceHolderImages: ImagePlaceholder[] = Array.isArray(data?.placeholderImages) ? data.placeholderImages : [];
