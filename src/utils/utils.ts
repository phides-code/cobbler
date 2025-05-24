export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
        return text;
    }

    const truncatedText = text.slice(0, maxLength - 3);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');

    return lastSpaceIndex !== -1
        ? truncatedText.slice(0, lastSpaceIndex) + '...'
        : truncatedText + '...';
};
