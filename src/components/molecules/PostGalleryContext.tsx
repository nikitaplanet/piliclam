'use client';

import {createContext, useContext} from 'react';
import type {GalleryImage} from '@/lib/postGallery';

export type PostGalleryContextValue = {
	images: GalleryImage[];
	openAt: (index: number) => void;
};

export const PostGalleryContext = createContext<PostGalleryContextValue | null>(null);

export function usePostGallery() {
	return useContext(PostGalleryContext);
}
