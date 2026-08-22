export function handleTransactionError(error: unknown, message: string, place: string) {
    console.error(`${place} error`, error);
    let errorMessage = message;
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }
    return { success: false, error: errorMessage };
}
